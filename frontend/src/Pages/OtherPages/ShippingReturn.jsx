import React from 'react';
import { Truck, Package, Globe, Shield, Clock, MapPin, AlertCircle, CheckCircle, XCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingReturn = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="bg-gradient-to-br from-pink-200 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                                <Truck className="w-10 h-10 text-rose-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            Shipping & <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Return Policy</span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Learn about our shipping options, delivery timelines, and policies for Panisho's 
                            premium beauty & hair care products across India.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Shipping Highlights */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Package className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">FREE</div>
                            <div className="text-sm text-gray-600">Shipping above ₹499</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Clock className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">3-7 Days</div>
                            <div className="text-sm text-gray-600">Delivery Time</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Globe className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">Pan-India</div>
                            <div className="text-sm text-gray-600">Coverage</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Shield className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">Safe</div>
                            <div className="text-sm text-gray-600">Packaging</div>
                        </div>
                    </div>

                    {/* Shipping Policy */}
                    <div className="space-y-8">
                        
                        {/* Shipping Charges */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Package className="w-8 h-8 text-rose-500 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Shipping Charges</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                                        <h3 className="text-xl font-bold text-gray-800">FREE Shipping</h3>
                                    </div>
                                    <div className="text-3xl font-bold text-green-600 mb-2">₹0</div>
                                    <p className="text-gray-700 mb-4">On orders above ₹499</p>
                                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                        <p className="text-sm text-gray-600">
                                            Enjoy free shipping across India when you spend ₹499 or more. 
                                            Perfect for stocking up on your favorite products!
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-200">
                                    <div className="flex items-center mb-4">
                                        <Truck className="w-6 h-6 text-rose-600 mr-3" />
                                        <h3 className="text-xl font-bold text-gray-800">Standard Shipping</h3>
                                    </div>
                                    <div className="text-3xl font-bold text-rose-600 mb-2">₹59</div>
                                    <p className="text-gray-700 mb-4">On orders below ₹499</p>
                                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                        <p className="text-sm text-gray-600">
                                            Affordable shipping rate for smaller orders. 
                                            Add more products to qualify for free shipping!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Timeline */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Clock className="w-8 h-8 text-rose-500 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Delivery Timeline</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                                    <MapPin className="w-8 h-8 text-rose-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Metro Cities</h3>
                                    <div className="text-2xl font-bold text-rose-600 mb-2">3-5 Days</div>
                                    <p className="text-gray-600 text-sm">
                                        Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad
                                    </p>
                                </div>
                                
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                                    <Globe className="w-8 h-8 text-rose-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Tier 2 Cities</h3>
                                    <div className="text-2xl font-bold text-rose-600 mb-2">4-6 Days</div>
                                    <p className="text-gray-600 text-sm">
                                        State capitals and major cities across India
                                    </p>
                                </div>
                                
                                <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                                    <Package className="w-8 h-8 text-rose-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Other Areas</h3>
                                    <div className="text-2xl font-bold text-rose-600 mb-2">5-7 Days</div>
                                    <p className="text-gray-600 text-sm">
                                        Remote areas and smaller towns
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Note:</strong> Delivery times may vary during festivals, peak seasons, or due to unforeseen circumstances. 
                                            We'll keep you updated about any delays via SMS and email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coverage Area */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Globe className="w-8 h-8 text-rose-500 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Coverage Area</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                                        Currently Available
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                            <div className="flex items-center mb-2">
                                                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                                                <strong className="text-gray-800">All of India</strong>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                We deliver to all states and union territories across India, 
                                                including remote areas and islands.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div>• All Metro Cities</div>
                                            <div>• State Capitals</div>
                                            <div>• Tier 2 & 3 Cities</div>
                                            <div>• Rural Areas</div>
                                            <div>• North East States</div>
                                            <div>• Island Territories</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <Clock className="w-6 h-6 text-rose-600 mr-2" />
                                        Coming Soon
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
                                            <div className="flex items-center mb-2">
                                                <Globe className="w-5 h-5 text-rose-600 mr-2" />
                                                <strong className="text-gray-800">International Shipping</strong>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                We're working on expanding our services globally to serve 
                                                our international customers. Stay tuned!
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p className="mb-2"><strong>Planned Markets:</strong></p>
                                            <div className="grid grid-cols-2 gap-1">
                                                <div>• United States</div>
                                                <div>• Canada</div>
                                                <div>• United Kingdom</div>
                                                <div>• Australia</div>
                                                <div>• UAE & Middle East</div>
                                                <div>• Southeast Asia</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return Policy */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <XCircle className="w-8 h-8 text-red-500 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Return & Exchange Policy</h2>
                            </div>
                            
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200 mb-6">
                                <div className="flex items-start">
                                    <XCircle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">No Returns or Exchanges</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Due to hygiene and safety reasons, we currently do not accept returns or exchanges 
                                            on our beauty & hair care products. This policy helps us maintain the highest 
                                            standards of product quality and customer safety.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                                    <div className="flex items-center mb-4">
                                        <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                                        <h3 className="text-lg font-bold text-gray-800">Damaged Products</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        If you receive a damaged or defective product, please contact us within 
                                        <strong> 48 hours</strong> of delivery with photos. We'll investigate and provide 
                                        appropriate solutions including replacement or refund.
                                    </p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center mb-4">
                                        <Heart className="w-6 h-6 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-bold text-gray-800">Our Assurance</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        We provide detailed product descriptions, ingredient lists, and customer support 
                                        to help you make informed decisions. Our quality control ensures you receive 
                                        only the best products.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Cancellation */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <AlertCircle className="w-8 h-8 text-orange-500 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-800">Order Cancellation</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-1 gap-6">
                          
                                
                                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                                    <div className="flex items-center mb-4">
                                        <XCircle className="w-6 h-6 text-red-600 mr-3" />
                                        <h3 className="text-lg font-bold text-gray-800">Cancellation Not Allowed</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                        Once your order has been shipped, cancellation is not possible. 
                                        You'll receive tracking information via SMS and email.
                                    </p>
                                    <div className="text-xs text-gray-600">
                                        <p>• Order already in transit</p>
                                        <p>• Tracking number provided</p>
                                        <p>• Contact support for special cases</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200 text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Your Order?</h3>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Our customer support team is here to assist you with any questions about 
                                shipping, orders, or our products. We're committed to providing excellent service!
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-6">
                               <Link to="/profile">
                                <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Track Order
                                </button>
                                </Link>
                                <Link to='/contact'>
                                <button className="bg-white border-2 border-rose-300 text-rose-600 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white hover:border-transparent shadow-lg hover:shadow-xl hover:scale-105 flex items-center">
                                    <Truck className="w-5 h-5 mr-2" />
                                    Contact Support
                                </button>
                                </Link>
                            </div>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> Support@panisho.com</p>
                                <p><strong>WhatsApp:</strong> +91 8160467524</p>
                                <p><strong>Support Hours:</strong> Mon-Sat, 9 AM - 8 PM</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingReturn;