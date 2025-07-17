import React from 'react';
import { FileText, Shield, Users, Globe, AlertTriangle, CheckCircle, Scale, Lock, Heart } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="bg-gradient-to-br from-pink-200 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                                <FileText className="w-10 h-10 text-rose-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            Terms & <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Conditions</span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Please read these terms and conditions carefully before using Panisho's services 
                            or purchasing our premium beauty & hair care products.
                        </p>
                        <div className="mt-8 inline-block bg-gradient-to-r from-rose-100 to-pink-100 backdrop-blur-sm rounded-full px-6 py-3 text-rose-800 font-semibold text-sm">
                            Effective Date: July 2025
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
                            <h2 className="text-3xl font-bold text-gray-800">Welcome to Panisho</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            These Terms and Conditions govern your use of the Panisho website and services, 
                            and your purchase of our premium beauty & hair care products. By accessing our website 
                            or making a purchase, you agree to be bound by these terms.
                        </p>
                    </div>

                    {/* Terms Sections */}
                    <div className="space-y-8">
                        
                        {/* Acceptance of Terms */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <CheckCircle className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Acceptance of Terms</h3>
                            </div>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    By accessing and using the Panisho website (panisho.in), placing an order, 
                                    or using our services, you acknowledge that you have read, understood, and agree 
                                    to be bound by these Terms and Conditions.
                                </p>
                                <p>
                                    If you do not agree with any part of these terms, please do not use our website 
                                    or services. We reserve the right to modify these terms at any time, and continued 
                                    use of our services constitutes acceptance of any changes.
                                </p>
                            </div>
                        </div>

                        {/* Use of Website */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Globe className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Use of Website</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Permitted Use</h4>
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        You may use our website for lawful purposes only. You are granted a limited, 
                                        non-exclusive, non-transferable license to access and use our website for 
                                        personal, non-commercial purposes.
                                    </p>
                                    <ul className="text-gray-700 space-y-2 ml-6">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Browse and purchase our products
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Create and manage your account
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Access customer support services
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            View product information and reviews
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h4>
                                    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
                                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                            You agree not to use our website for any unlawful purpose or engage in:
                                        </p>
                                        <ul className="text-gray-700 text-sm space-y-1 ml-4">
                                            <li>• Unauthorized copying or distribution of our content</li>
                                            <li>• Attempting to gain unauthorized access to our systems</li>
                                            <li>• Interfering with website functionality or security</li>
                                            <li>• Submitting false or misleading information</li>
                                            <li>• Using automated systems to access our website</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Shield className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Product Information</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Product Descriptions</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        We strive to provide accurate product descriptions, images, and pricing. 
                                        However, we do not guarantee that all information is error-free, complete, 
                                        or current. Colors may vary due to monitor settings.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Product Availability</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        All products are subject to availability. We reserve the right to discontinue 
                                        any product at any time. In case of unavailability, we'll notify you and 
                                        offer alternatives or refunds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Orders and Payments */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Users className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Orders and Payments</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Order Acceptance</h4>
                                        <p className="text-gray-700 text-sm">
                                            Your order constitutes an offer to purchase. We reserve the right to accept 
                                            or decline any order. Order confirmation doesn't guarantee acceptance.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Payment Terms</h4>
                                        <p className="text-gray-700 text-sm">
                                            Payment must be received before order processing. We accept various payment 
                                            methods including cards, UPI, and digital wallets.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">Pricing</h4>
                                    <p className="text-gray-700 text-sm">
                                        All prices are in Indian Rupees (INR) and include applicable taxes. Prices are subject 
                                        to change without notice. Shipping charges apply as per our shipping policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping and Returns */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Shipping and Returns</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Policy</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Free shipping on orders above ₹499. Standard shipping charges of ₹59 apply to orders below ₹499. 
                                        Delivery typically takes 3-7 business days across India. International shipping coming soon.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">Return Policy</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Due to hygiene and safety reasons, we do not accept returns or exchanges. 
                                        However, damaged or defective products will be replaced or refunded upon verification.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Intellectual Property */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Lock className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Intellectual Property</h3>
                            </div>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    All content on this website, including but not limited to text, graphics, logos, 
                                    images, videos, and software, is the property of Panisho and protected by copyright, 
                                    trademark, and other intellectual property laws.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Our Rights</h4>
                                        <p className="text-gray-700 text-sm">
                                            Panisho retains all rights to our trademarks, brand names, logos, 
                                            and proprietary designs. Unauthorized use is prohibited.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Your Content</h4>
                                        <p className="text-gray-700 text-sm">
                                            Any content you submit (reviews, photos) grants us a license to use, 
                                            modify, and display such content for business purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Scale className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Limitation of Liability</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Panisho's liability is limited to the maximum extent permitted by law. We shall not be 
                                        liable for any indirect, incidental, special, or consequential damages arising from your 
                                        use of our products or services.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                        <h4 className="font-semibold text-gray-800 mb-2">Product Use</h4>
                                        <p className="text-gray-600">
                                            Users are responsible for following product instructions and conducting patch tests.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-semibold text-gray-800 mb-2">Technical Issues</h4>
                                        <p className="text-gray-600">
                                            We're not liable for website downtime, technical errors, or data loss.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-semibold text-gray-800 mb-2">Third Parties</h4>
                                        <p className="text-gray-600">
                                            We're not responsible for third-party services, links, or payment processors.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy and Data Protection */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Shield className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Privacy and Data Protection</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Your privacy is important to us. Our collection, use, and protection of your personal 
                                information is governed by our Privacy Policy, which forms an integral part of these 
                                Terms and Conditions. Please review our Privacy Policy to understand our practices.
                            </p>
                        </div>

                        {/* Governing Law */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <Scale className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Governing Law</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Jurisdiction</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        These Terms and Conditions are governed by the laws of India. Any disputes shall be 
                                        subject to the exclusive jurisdiction of the courts in Surat, Gujarat, India.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Dispute Resolution</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        We encourage resolving disputes through direct communication. If formal resolution 
                                        is needed, disputes will be handled in accordance with Indian law.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Changes to Terms */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200">
                            <div className="flex items-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-rose-500 mr-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Changes to Terms</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be 
                                effective immediately upon posting on our website. Your continued use of our services 
                                after changes are posted constitutes acceptance of the modified terms. We recommend 
                                reviewing these terms periodically.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions About These Terms?</h3>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    If you have any questions about these Terms and Conditions or need clarification 
                                    on any points, please don't hesitate to contact us.
                                </p>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> Support@panisho.com</p>
                                    <p><strong>Phone:</strong> +91 8160467524</p>
                                    <p><strong>Address:</strong> 31 Reva nagar near south zone office udhana Surat - 394210</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="py-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 mb-2">
                        By using Panisho's website and services, you acknowledge that you have read and agree to these Terms and Conditions.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Last Updated: July 2025 | © 2025 Panisho. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;