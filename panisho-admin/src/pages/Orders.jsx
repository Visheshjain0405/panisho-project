import React, { useState } from 'react';
import { Plus, Eye, Trash2, Edit } from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import OrderDisplay from '../component/orders/OrderDisplay';
import Header from '../component/common/Header';

const Orders = () => {

  return (
       <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col sm:ml-64 ml-0">
        <Header />
        <main className="flex-1 bg-secondary p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
            Orders
          </h2>
          <OrderDisplay />
        </main>
      </div>
    </div>
  );
};

export default Orders;