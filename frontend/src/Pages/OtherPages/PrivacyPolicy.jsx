import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Globe, Heart, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="bg-gradient-to-br from-pink-200 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                                <Shield className="w-10 h-10 text-rose-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            Privacy <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Your privacy is important to us. Learn how we protect and handle your personal information
                            when you use Panisho's beauty & hair care services.
                        </p>
                        <div className="mt-8 inline-block bg-gradient-to-r from-rose-100 to-pink-100 backdrop-blur-sm rounded-full px-6 py-3 text-rose-800 font-semibold text-sm">
                            Last Updated: July 2025
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    
                    {/* Introduction */}
                    <div className="mb-12 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
                        <div className="flex items-center mb-6">
                            <Heart className="w-8 h-8 text-rose-500 mr-4" />
                            <h2 className="text-3xl font-bold text-gray-800">Our Commitment to Your Privacy</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            At Panisho, we are committed to protecting your privacy and ensuring the security of your personal information. 
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                            or purchase our premium beauty & hair care products.
                        </p>
                    </div>

                    {/* Privacy Sections */}
                    <div className="space-y-8">
                        
                        {/* Information We Collect */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <FileText className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Information We Collect</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h4>
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        When you make a purchase or create an account, we may collect:
                                    </p>
                                    <ul className="text-gray-700 space-y-2 ml-6">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Name, email address, and phone number
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Billing and shipping addresses
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Payment information (processed securely)
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Communication preferences
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        We automatically collect information about how you interact with our website, including 
                                        IP address, browser type, pages visited, and time spent on our site to improve your experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Users className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">How We Use Your Information</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Process and fulfill your orders</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Provide customer support and assistance</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Send order confirmations and updates</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Improve our website and services</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Send promotional offers (with consent)</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Prevent fraud and ensure security</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Comply with legal obligations</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p className="text-gray-700">Personalize your shopping experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Information Sharing */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Globe className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Information Sharing</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                            </p>
                            <div className="space-y-3">
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-100">
                                    <strong className="text-gray-800">Service Providers:</strong> 
                                    <span className="text-gray-700"> Trusted third parties who assist in operating our website, conducting business, or serving you.</span>
                                </div>
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-100">
                                    <strong className="text-gray-800">Legal Requirements:</strong> 
                                    <span className="text-gray-700"> When required by law or to protect our rights, property, or safety.</span>
                                </div>
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-100">
                                    <strong className="text-gray-800">Business Transfer:</strong> 
                                    <span className="text-gray-700"> In the event of a merger, acquisition, or sale of assets.</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Lock className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Data Security</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                We implement appropriate technical and organizational security measures to protect your personal information against 
                                unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                                    <Shield className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-800 mb-2">SSL Encryption</h4>
                                    <p className="text-sm text-gray-600">Secure data transmission</p>
                                </div>
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                                    <Lock className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-800 mb-2">Secure Storage</h4>
                                    <p className="text-sm text-gray-600">Protected databases</p>
                                </div>
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                                    <Eye className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-800 mb-2">Access Control</h4>
                                    <p className="text-sm text-gray-600">Limited data access</p>
                                </div>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <CheckCircle className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Your Rights</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Access your personal information</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Correct inaccurate information</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Request deletion of your data</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Opt-out of marketing communications</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Data portability</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span className="text-gray-700">Lodge a complaint</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions About Privacy?</h3>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    If you have any questions about this Privacy Policy or our data practices, 
                                    please don't hesitate to contact us.
                                </p>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> Support@panisho.com</p>
                                    <p><strong>Phone:</strong> +91 8160467524</p>
                                    <p><strong>Address:</strong> 31 Reva nagar near south zone office udhana Surat -394210</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="py-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600">
                        This Privacy Policy may be updated from time to time. We will notify you of any significant changes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;