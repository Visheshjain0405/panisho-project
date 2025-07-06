import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary text-secondary p-4 flex justify-between items-center">
      <h1 className="text-lg sm:text-xl font-bold">E-Commerce Admin</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm hidden sm:block">Admin User</span>
        <button className="bg-secondary text-primary px-3 py-1 rounded-md hover:bg-gray-200 text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;