import React, { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  Edit2,
  Trash2,
} from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth');
        const mapped = res.data.map((u) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.mobile,
          registrationDate: u.createdAt,
          lastLogin: u.updatedAt,
          totalOrders: u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-black mb-2">Users</h1>
        <p className="text-gray-600 mb-8">Manage registered users</p>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Contact</TableHeader>
                  <TableHeader>Registration</TableHeader>
                  <TableHeader>Last Login</TableHeader>
                  <TableHeader>Orders</TableHeader>
                  <TableHeader>Total Spent</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" /> {user.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <Calendar size={14} className="inline-block mr-1 text-gray-400" />
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-medium">{user.totalOrders}</td>
                    <td className="py-4 px-6 text-gray-700 font-medium">${user.totalSpent.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentUsers.length === 0 && (
            <div className="text-center py-12">
              <User size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const TableHeader = ({ children }) => (
  <th className="text-left py-4 px-6 text-gray-700 font-semibold">{children}</th>
);

export default Users;
