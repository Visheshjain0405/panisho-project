import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Constants
const ITEMS_PER_PAGE = 10;
const PAYMENT_METHODS = [
  { value: '', label: 'All Payment Methods' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' }
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverage' }
];

const PAYMENT_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }
];

const DATE_PRESETS = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'This Year', days: 365 }
];

const REPORT_TYPES = {
  SALES: 'sales',
  PAYMENT: 'payment',
  PRODUCT: 'product'
};

const TABLE_CONFIGS = {
  [REPORT_TYPES.SALES]: {
    title: '📊 Sales Report',
    columns: ['Date', 'Orders', 'Revenue', 'Avg Order Value'],
    filename: 'sales_report',
    exportColumns: ['date', 'orders', 'revenue', 'avgOrderValue']
  },
  [REPORT_TYPES.PAYMENT]: {
    title: '💰 Payment Report',
    columns: ['Transaction ID', 'Customer', 'Amount', 'Status', 'Method', 'Date'],
    filename: 'payment_report',
    exportColumns: ['transactionId', 'customer', 'amount', 'status', 'method', 'date']
  },
  [REPORT_TYPES.PRODUCT]: {
    title: '🛍️ Product Report',
    columns: ['Product', 'Category', 'Units Sold', 'Revenue', 'Stock'],
    filename: 'product_report',
    exportColumns: ['product', 'category', 'unitsSold', 'revenue', 'stock']
  }
};

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
const EXPORT_FORMATS = ['xlsx', 'csv', 'pdf', 'json'];

// Custom Hooks
const useReportData = (startDate, endDate, paymentMethod, category, customer) => {
  const [data, setData] = useState({
    salesData: [],
    paymentData: [],
    productData: [],
    summaryStats: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        paymentMethod,
        customer,
        category
      };

      const [salesRes, paymentRes, productRes, statsRes] = await Promise.all([
        api.get('/reports/sales', { params }),
        api.get('/reports/payment', { params }),
        api.get('/reports/products', { params }),
        api.get('/reports/summary', { params })
      ]);

      setData({
        salesData: salesRes.data || [],
        paymentData: paymentRes.data || [],
        productData: productRes.data || [],
        summaryStats: statsRes.data || {}
      });
      setRetryCount(0);
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(prev => prev + 1), 2000);
      } else {
        setError('Failed to fetch reports after multiple attempts. Please try again later.');
        console.error('Error fetching reports:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, paymentMethod, category, customer, retryCount]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { ...data, loading, error, refetch: fetchReports };
};

const usePagination = (data, itemsPerPage = ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  useEffect(() => setCurrentPage(1), [data]);

  return { paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage, hasNextPage: currentPage < totalPages, hasPrevPage: currentPage > 1 };
};

const useSort = (data, defaultSortKey) => {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: 'asc'
  });

  const sortedData = useMemo(() => {
    const sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  return { sortedData, sortConfig, requestSort };
};

const useTableFilter = (data, filterConfig) => {
  const filteredData = useMemo(() => {
    if (!filterConfig) return data;

    return data.filter(row => {
      if (filterConfig.minRevenue && row.revenue < filterConfig.minRevenue) return false;
      if (filterConfig.maxRevenue && row.revenue > filterConfig.maxRevenue) return false;
      if (filterConfig.status && row.status !== filterConfig.status) return false;
      if (filterConfig.minStock && row.stock < filterConfig.minStock) return false;
      if (filterConfig.maxStock && row.stock > filterConfig.maxStock) return false;
      return true;
    });
  }, [data, filterConfig]);

  return filteredData;
};

// Components
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="text-red-800 font-medium">{message}</span>
      </div>
      <button onClick={onRetry} className="text-sm text-blue-600 hover:underline">Retry</button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading reports...</span>
  </div>
);

const SummaryStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[
      { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
      { label: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒' },
      { label: 'Avg Order Value', value: `₹${(stats.avgOrderValue || 0).toLocaleString()}`, icon: '📈' },
      { label: 'Unique Customers', value: stats.uniqueCustomers || 0, icon: '👥' }
    ].map((stat, idx) => (
      <div key={idx} className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{stat.icon}</span>
          <div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const FilterControls = ({
  startDate,
  endDate,
  paymentMethod,
  category,
  customer,
  onStartDateChange,
  onEndDateChange,
  onPaymentMethodChange,
  onCategoryChange,
  onCustomerChange,
  onPresetChange
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Global Filters</h3>
      <div className="space-x-2">
        {DATE_PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => onPresetChange(preset.days)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholderText="Select start date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholderText="Select end date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={onPaymentMethodChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          {PAYMENT_METHODS.map(method => (
            <option key={method.value} value={method.value}>{method.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={category}
          onChange={onCategoryChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
        <input
          type="text"
          value={customer}
          onChange={onCustomerChange}
          placeholder="Search customer..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

const SalesTableFilter = ({ minRevenue, maxRevenue, onMinRevenueChange, onMaxRevenueChange }) => (
  <div className="flex space-x-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Min Revenue</label>
      <input
        type="number"
        value={minRevenue || ''}
        onChange={onMinRevenueChange}
        placeholder="Min revenue..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Max Revenue</label>
      <input
        type="number"
        value={maxRevenue || ''}
        onChange={onMaxRevenueChange}
        placeholder="Max revenue..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

const PaymentTableFilter = ({ status, onStatusChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
    <select
      value={status}
      onChange={onStatusChange}
      className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    >
      {PAYMENT_STATUSES.map(status => (
        <option key={status.value} value={status.value}>{status.label}</option>
      ))}
    </select>
  </div>
);

const ProductTableFilter = ({ minStock, maxStock, onMinStockChange, onMaxStockChange }) => (
  <div className="flex space-x-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
      <input
        type="number"
        value={minStock || ''}
        onChange={onMinStockChange}
        placeholder="Min stock..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock</label>
      <input
        type="number"
        value={maxStock || ''}
        onChange={onMaxStockChange}
        placeholder="Max stock..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

const ExportButton = ({ onExport, filename, disabled, format, onFormatChange }) => (
  <div className="flex items-center space-x-2">
    <select
      value={format}
      onChange={onFormatChange}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    >
      {EXPORT_FORMATS.map(fmt => (
        <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
      ))}
    </select>
    <button
      onClick={onExport}
      disabled={disabled}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export
    </button>
  </div>
);

const SalesChart = ({ data }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium text-gray-700 mb-4">Revenue Trend</h3>
    <div className="bg-white rounded-lg p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ backgroundColor: '#fff', color: '#000', border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PaymentDistributionChart = ({ data }) => {
  const paymentStats = useMemo(() => {
    const stats = data.reduce((acc, curr) => {
      acc[curr.method] = (acc[curr.method] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(stats).map(([method, amount]) => ({ name: method, value: amount }));
  }, [data]);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Payment Method Distribution</h3>
      <div className="bg-white rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentStats}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            >
              {paymentStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DataTable = ({ columns, data, pagination, scrollRef, sortConfig, requestSort, reportType }) => {
  const { paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage, hasNextPage, hasPrevPage } = pagination;

  const handlePageChange = useCallback((page) => {
    goToPage(page);
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [goToPage, scrollRef]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-lg">No data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(TABLE_CONFIGS[reportType].exportColumns[idx])}
                >
                  <div className="flex items-center">
                    {column}
                    {sortConfig.key === TABLE_CONFIGS[reportType].exportColumns[idx] && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of{' '}
              {data.length} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection = ({ title, children }) => (
  <div className="mb-10 bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

// Main Component
function Reports() {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('');
  const [category, setCategory] = useState('');
  const [customer, setCustomer] = useState('');
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [salesFilters, setSalesFilters] = useState({ minRevenue: '', maxRevenue: '' });
  const [paymentFilters, setPaymentFilters] = useState({ status: '' });
  const [productFilters, setProductFilters] = useState({ minStock: '', maxStock: '' });

  const { salesData, paymentData, productData, summaryStats, loading, error, refetch } = useReportData(
    startDate,
    endDate,
    paymentMethod,
    category,
    customer
  );

  const salesSort = useSort(salesData, 'date');
  const paymentSort = useSort(paymentData, 'date');
  const productSort = useSort(productData, 'revenue');

  const filteredSalesData = useTableFilter(salesSort.sortedData, salesFilters);
  const filteredPaymentData = useTableFilter(paymentSort.sortedData, paymentFilters);
  const filteredProductData = useTableFilter(productSort.sortedData, productFilters);

  const salesPagination = usePagination(filteredSalesData);
  const paymentPagination = usePagination(filteredPaymentData);
  const productPagination = usePagination(filteredProductData);

  const salesRef = useRef(null);
  const paymentRef = useRef(null);
  const productRef = useRef(null);

  const exportToFile = useCallback((data, filename, format, columns) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const exportData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
          newRow[col] = row[col];
        });
        return newRow;
      });

      if (format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        const colWidths = Object.keys(exportData[0]).map(key => ({
          wch: Math.max(key.length, ...exportData.map(row => String(row[key]).length))
        }));
        worksheet['!cols'] = colWidths;
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else if (format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(`${filename.replace('_', ' ').toUpperCase()} - ${new Date().toLocaleDateString()}`, 14, 20);
        doc.autoTable({
          head: [columns.map(col => col.replace(/([A-Z])/g, ' $1').trim())],
          body: exportData.map(row => Object.values(row)),
          startY: 30,
          theme: 'striped',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [79, 70, 229] }
        });
        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.json`);
      }
    } catch (error) {
      console.error('Error exporting to file:', error);
      alert('Failed to export data. Please try again.');
    }
  }, []);

  const handlePresetChange = useCallback((days) => {
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - days);
    setStartDate(newStartDate);
    setEndDate(new Date());
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
            <p className="text-gray-600">Analyze your business performance with detailed reports</p>
          </header>

          <FilterControls
            startDate={startDate}
            endDate={endDate}
            paymentMethod={paymentMethod}
            category={category}
            customer={customer}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onPaymentMethodChange={(e) => setPaymentMethod(e.target.value)}
            onCategoryChange={(e) => setCategory(e.target.value)}
            onCustomerChange={(e) => setCustomer(e.target.value)}
            onPresetChange={handlePresetChange}
          />

          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-8">
              <SummaryStats stats={summaryStats} />

              {/* Sales Report */}
              <ReportSection title={TABLE_CONFIGS[REPORT_TYPES.SALES].title}>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Track your sales performance and revenue trends</p>
                  <ExportButton
                    onExport={() => exportToFile(filteredSalesData, TABLE_CONFIGS[REPORT_TYPES.SALES].filename, exportFormat, TABLE_CONFIGS[REPORT_TYPES.SALES].exportColumns)}
                    disabled={filteredSalesData.length === 0}
                    format={exportFormat}
                    onFormatChange={(e) => setExportFormat(e.target.value)}
                  />
                </div>
                <SalesTableFilter
                  minRevenue={salesFilters.minRevenue}
                  maxRevenue={salesFilters.maxRevenue}
                  onMinRevenueChange={(e) => setSalesFilters(prev => ({ ...prev, minRevenue: e.target.value }))}
                  onMaxRevenueChange={(e) => setSalesFilters(prev => ({ ...prev, maxRevenue: e.target.value }))}
                />
                <SalesChart data={filteredSalesData} />
                <div ref={salesRef}>
                  <DataTable
                    columns={TABLE_CONFIGS[REPORT_TYPES.SALES].columns}
                    data={filteredSalesData}
                    pagination={salesPagination}
                    scrollRef={salesRef}
                    sortConfig={salesSort.sortConfig}
                    requestSort={salesSort.requestSort}
                    reportType={REPORT_TYPES.SALES}
                  />
                </div>
              </ReportSection>

              {/* Payment Report */}
              <ReportSection title={TABLE_CONFIGS[REPORT_TYPES.PAYMENT].title}>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Monitor payment transactions and methods</p>
                  <ExportButton
                    onExport={() => exportToFile(filteredPaymentData, TABLE_CONFIGS[REPORT_TYPES.PAYMENT].filename, exportFormat, TABLE_CONFIGS[REPORT_TYPES.PAYMENT].exportColumns)}
                    disabled={filteredPaymentData.length === 0}
                    format={exportFormat}
                    onFormatChange={(e) => setExportFormat(e.target.value)}
                  />
                </div>
                <PaymentTableFilter
                  status={paymentFilters.status}
                  onStatusChange={(e) => setPaymentFilters(prev => ({ ...prev, status: e.target.value }))}
                />
                <PaymentDistributionChart data={filteredPaymentData} />
                <div ref={paymentRef}>
                  <DataTable
                    columns={TABLE_CONFIGS[REPORT_TYPES.PAYMENT].columns}
                    data={filteredPaymentData}
                    pagination={paymentPagination}
                    scrollRef={paymentRef}
                    sortConfig={paymentSort.sortConfig}
                    requestSort={paymentSort.requestSort}
                    reportType={REPORT_TYPES.PAYMENT}
                  />
                </div>
              </ReportSection>

              {/* Product Report */}
              <ReportSection title={TABLE_CONFIGS[REPORT_TYPES.PRODUCT].title}>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Analyze product performance and inventory</p>
                  <ExportButton
                    onExport={() => exportToFile(filteredProductData, TABLE_CONFIGS[REPORT_TYPES.PRODUCT].filename, exportFormat, TABLE_CONFIGS[REPORT_TYPES.PRODUCT].exportColumns)}
                    disabled={filteredProductData.length === 0}
                    format={exportFormat}
                    onFormatChange={(e) => setExportFormat(e.target.value)}
                  />
                </div>
                <ProductTableFilter
                  minStock={productFilters.minStock}
                  maxStock={productFilters.maxStock}
                  onMinStockChange={(e) => setProductFilters(prev => ({ ...prev, minStock: e.target.value }))}
                  onMaxStockChange={(e) => setProductFilters(prev => ({ ...prev, maxStock: e.target.value }))}
                />
                <div ref={productRef}>
                  <DataTable
                    columns={TABLE_CONFIGS[REPORT_TYPES.PRODUCT].columns}
                    data={filteredProductData}
                    pagination={productPagination}
                    scrollRef={productRef}
                    sortConfig={productSort.sortConfig}
                    requestSort={productSort.requestSort}
                    reportType={REPORT_TYPES.PRODUCT}
                  />
                </div>
              </ReportSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;