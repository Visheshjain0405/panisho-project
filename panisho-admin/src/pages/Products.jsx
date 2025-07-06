import React from 'react';
import Header from '../component/common/Header';
import Sidebar from '../component/common/Sidebar';
import ProductDisplay from '../component/products/ProductDisplay';

const Products = () => {
  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col sm:ml-64 ml-0">
        <Header />
        <main className="flex-1 bg-secondary p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
            Products
          </h2>
          <ProductDisplay />
        </main>
      </div>
    </div>
  );
};

export default Products;