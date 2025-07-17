import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="sm:hidden bg-primary text-secondary p-2 fixed top-4 left-4 z-20"
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
      <div
        className={`bg-primary text-secondary w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 transition-transform duration-200 ease-in-out z-10`}
      >
        <h2 className="text-xl font-semibold px-4">Admin Menu</h2>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Categories
          </NavLink>
          <NavLink
            to="/coupons"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Coupons
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Users
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Reviews
          </NavLink>
          <NavLink
            to="/sliderimages"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Slider Images
          </NavLink>
          <NavLink
            to="/email-marketing"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Email Marketing
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Payments
          </NavLink>
          <NavLink
            to="/customersupport"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Customer Support
          </NavLink>
          <NavLink
            to="/navbarcategories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Navbar Categories
          </NavLink>
           <NavLink
            to="/reports"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Reports
          </NavLink>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? 'bg-secondary text-primary' : 'text-secondary hover:bg-gray-800'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;