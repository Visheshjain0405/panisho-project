import React, { useState } from 'react';
import Header from '../component/common/Header';
import Sidebar from '../component/common/Sidebar';
import CategoryDisplay from '../component/categories/CategoryDisplay';
import NavbarCategoryAddModal from '../component/categories/NavbarCategoryAddModal';

const Categories = () => {
  const [isNavbarAddModalOpen, setIsNavbarAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col sm:ml-64 ml-0">
        <Header 
          onAddNavbarCategory={() => setIsNavbarAddModalOpen(true)}
        />
        <main className="flex-1 bg-secondary p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
            Categories
          </h2>
          <CategoryDisplay />
        </main>
        {isNavbarAddModalOpen && (
          <NavbarCategoryAddModal
            onClose={() => setIsNavbarAddModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;