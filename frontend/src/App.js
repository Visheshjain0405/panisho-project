import logo from './logo.svg';
import './App.css';
import Navbar from './Component/Navbar/Navbar';
import HeroSlider from './Component/Slider/HeroSlider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './Component/Footer/Footer';
import CartPage from './Component/Cart/CartPage';
import AuthPage from './Component/Auth/AuthPage';
import ContactUs from './Pages/Contact/Contact';
import AboutUs from './Pages/AboutUs/AboutUs';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProductCategories from './Component/Category/ProductCategories';
import CategoryPage from './Pages/Category/CategoryPage';
import { ToastContainer } from 'react-toastify';
import WishlistPage from './Pages/WishlistPage/WishlistPage';
import VerifyEmailPage from './Pages/Login/VerifyEmailPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import ProductDetail from './Component/Product/ProductDetail';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import HomePage from './Pages/HomePage/HomePage';

function App() {
  const location = useLocation();
  
  // Define routes where navbar and footer should be hidden
  const hideNavigationRoutes = ['/account', '/verify-email'];
  
  // Check if current route should hide navigation
  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  return (
    <div className="App">
      <ToastContainer />
      
      {/* Conditionally render Navbar */}
      {!shouldHideNavigation && <Navbar />}
      
      {/* Main content area with conditional padding */}
      <div className={shouldHideNavigation ? '' : 'pt-24 md:pt-28 lg:pt-32 bg-pink-50'}>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AuthPage />} />
          
          {/* Category routes: Beauty */}
          <Route
            path="/beauty-products/:categorySlug"
            element={<CategoryPage />}
          />

          {/* Category routes: Hair */}
          <Route
            path="/hair-products/:categorySlug"
            element={<CategoryPage />}
          />

          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/:id" element={<ProductDetail  />} />
          <Route path='/checkout' element={<CheckoutPage/>}/>

          {/* A fallback 404 route (optional) */}
          <Route
            path="*"
            element={
              <div className="mt-24 text-center text-red-500">
                <h2 className="text-2xl">404 — Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </div>
      
      {/* Conditionally render Footer */}
      {!shouldHideNavigation && <Footer />}

      
    </div>
  );
}

export default App;