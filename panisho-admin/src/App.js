import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Coupouns from './pages/Coupouns';
import Users from './pages/Users';
import CustomerReviews from './pages/CustomerReviews';
import SliderImages from './pages/SliderImages';
function App() {
  return (
    <>
      {/* ToastContainer lives at the app root */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<Categories />} />
        <Route path='/coupons' element={<Coupouns/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/reviews' element={<CustomerReviews/>}/>
        <Route path='/sliderimages' element={<SliderImages/>}/>
      </Routes>
    </>
  );
}

export default App;
