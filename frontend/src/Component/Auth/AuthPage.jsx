// src/pages/AuthPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, Sparkles, Shield, Heart, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { login, signup, verifyEmail } = useContext(AuthContext);
  const [step, setStep] = useState('login'); // 'login' | 'signup' | 'verify'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // keep tabs in sync
  useEffect(() => {
    // nothing else
  }, [step]);

  const handleTab = (tab) => setStep(tab);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step === 'login') {
        await login(loginForm.email, loginForm.password);
        toast.success('Logged in successfully!');
        navigate('/');
      } else if (step === 'signup') {
        if (signupForm.password !== signupForm.confirmPassword) {
          return toast.error('Passwords do not match');
        }
        await signup(
          signupForm.firstName,
          signupForm.lastName,
          signupForm.email,
          signupForm.mobileNumber,
          signupForm.password
        );
        setStep('verify');
        toast.info('OTP sent! Check your email.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Authentication failed';
      toast.error(msg);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(otp);
      toast.success('Email verified! You can now log in.');
      setStep('login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Wrong or expired OTP';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-rose-200 rounded-full opacity-30 blur-lg"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        {step === 'verify' ? (
          // OTP Verification - Single Card Layout
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-pink-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h1>
              <p className="text-gray-600 mb-8">
                Enter the 6-digit code sent to your email
              </p>
              
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength="6"
                      className="w-full h-16 text-center text-2xl font-bold tracking-widest rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-pink-400 focus:bg-white transition-all"
                      placeholder="000000"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                >
                  Verify & Continue
                </button>
              </form>
              
              <button
                onClick={() => setStep('login')}
                className="mt-6 text-pink-600 hover:text-pink-800 font-medium"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          // Login/Signup - Split Screen Layout
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Brand Content */}
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="relative z-10 text-center lg:text-left max-w-md mx-auto lg:mx-0">
                {step === 'login' ? (
                  <>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Welcome back!
                    </h2>
                    <p className="text-lg lg:text-xl opacity-90 mb-8 leading-relaxed">
                      Continue your beauty journey with premium skincare and haircare products. 
                      We're so happy to have you here!
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Star size={16} />
                        </div>
                        <span>Premium beauty products</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                        <span>Secure & trusted platform</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Heart size={16} />
                        </div>
                        <span>Expert skincare guidance</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Join Panisho Today
                    </h2>
                    <p className="text-lg lg:text-xl opacity-90 mb-8 leading-relaxed">
                      Discover premium facewash, serums, sunscreen, shampoo, conditioner, and beard oil. 
                      Your beauty transformation starts here!
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <Sparkles size={20} className="mx-auto mb-2" />
                        <span>Face Care</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <Heart size={20} className="mx-auto mb-2" />
                        <span>Hair Care</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <Shield size={20} className="mx-auto mb-2" />
                        <span>Sun Protection</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <Star size={20} className="mx-auto mb-2" />
                        <span>Beard Care</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-sm mx-auto">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                  <img
                    src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png"
                    alt="Panisho"
                    className="w-28 h-28 mx-auto mb-4 object-contain"
                  />
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {step === 'login' ? 'Sign In' : 'Create Account'}
                  </h1>
                  <p className="text-gray-600">
                    {step === 'login' 
                      ? 'Welcome back to your beauty journey' 
                      : 'Join thousands who trust Panisho'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {step === 'login' ? (
                    <>
                      {/* Email */}
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={20} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                            required
                            className="pl-12 w-full h-14 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                            placeholder="Email address"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                            required
                            className="pl-12 pr-12 w-full h-14 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? (
                              <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                          <input
                            name="firstName"
                            value={signupForm.firstName}
                            onChange={handleSignupChange}
                            required
                            className="pl-11 w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800 text-sm"
                            placeholder="First name"
                          />
                        </div>
                        <input
                          name="lastName"
                          value={signupForm.lastName}
                          onChange={handleSignupChange}
                          required
                          className="w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800 text-sm px-4"
                          placeholder="Last name"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                          name="email"
                          type="email"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          required
                          className="pl-12 w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                          placeholder="Email address"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone size={20} className="text-gray-400" />
                        </div>
                        <input
                          name="mobileNumber"
                          type="tel"
                          value={signupForm.mobileNumber}
                          onChange={handleSignupChange}
                          required
                          className="pl-12 w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                          placeholder="Mobile number"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          required
                          className="pl-12 pr-12 w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          required
                          className="pl-12 pr-12 w-full h-12 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all text-gray-800"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Terms */}
                      <div className="flex items-start space-x-3 text-sm">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-400"
                          required
                        />
                        <span className="text-gray-600 leading-relaxed">
                          I agree to{' '}
                          <a href="#" className="text-pink-600 hover:text-pink-800">Terms</a>
                          {' '}and{' '}
                          <a href="#" className="text-pink-600 hover:text-pink-800">Privacy Policy</a>
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                      >
                        Create Account
                      </button>
                    </>
                  )}
                </form>

                {/* Toggle Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    {step === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      className="font-semibold text-pink-600 hover:text-pink-800"
                      onClick={() => setStep(step === 'login' ? 'signup' : 'login')}
                    >
                      {step === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;