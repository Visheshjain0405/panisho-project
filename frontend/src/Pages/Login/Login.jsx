import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Handle form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginForm);
    // Add your login logic here
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="py-6 text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Login to Your Account</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Please enter your details to access your account.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Form Container */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-3"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="mb-6">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-3"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Forgot Password */}
                <div className="flex justify-end mb-6">
                  <a href="#" className="text-sm text-pink-500 hover:text-pink-700">
                    Forgot your password?
                  </a>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              </form>
              
              {/* Social Login Options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zm3.1-9.5H6.9a.6.6 0 00-.6.6v3.8a.6.6 0 00.6.6h6.2a.6.6 0 00.6-.6V7.6a.6.6 0 00-.6-.6zm-.2 5H7.1V7.8h5.8v4.2z" />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.917.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Link to Sign Up */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-pink-500 hover:text-pink-700">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;