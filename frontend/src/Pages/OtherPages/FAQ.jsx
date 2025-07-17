import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Package, Truck, Shield, Heart, Star, Globe, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqCategories = [
        {
            title: "Orders & Products",
            icon: <Package className="w-6 h-6" />,
            questions: [
                {
                    question: "What types of products does Panisho offer?",
                    answer: "Panisho offers a comprehensive range of premium beauty & hair care products including face wash, face serums, baby care products, beard oil, conditioner, shampoo, sunscreen, and wellness solutions. All our products are made with natural ingredients and designed to enhance your natural beauty."
                },
                {
                    question: "How do I place an order?",
                    answer: "You can place an order through our website by browsing our products, adding items to your cart, and proceeding to checkout. You can also contact us directly via WhatsApp or phone to place an order with assistance from our team."
                },
                {
                    question: "Are your products suitable for all skin and hair types?",
                    answer: "Yes! Our products are formulated with natural ingredients to be gentle and effective for all skin and hair types. However, we recommend doing a patch test before using any new product, especially if you have sensitive skin."
                },
                {
                    question: "Do you offer product samples?",
                    answer: "Currently, we don't offer product samples, but we provide detailed product descriptions and ingredient lists to help you make informed decisions. Our customer support team is also available to help you choose the right products for your needs."
                },
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can use this tracking number to monitor your package's progress. You can also contact our customer support team for order updates."
                }
            ]
        },
        {
            title: "Shipping & Delivery",
            icon: <Truck className="w-6 h-6" />,
            questions: [
                {
                    question: "What are your shipping charges?",
                    answer: "We offer FREE shipping on all orders above ₹499 across India. For orders below ₹499, a delivery charge of ₹59 applies. We're working towards expanding globally soon!"
                },
                {
                    question: "How long does delivery take?",
                    answer: "We typically deliver within 3-7 business days across India, depending on your location. Metro cities usually receive orders within 3-5 days, while other areas may take 5-7 days."
                },
                {
                    question: "Do you deliver pan-India?",
                    answer: "Yes! We currently deliver to all locations across India. We're also planning to expand our services globally in the near future to serve our international customers."
                },
                {
                    question: "What if I'm not available during delivery?",
                    answer: "Our delivery partners will attempt delivery multiple times. If you're not available, they'll leave a notification with instructions for redelivery or pickup from the local delivery center."
                }
            ]
        },
        {
            title: "Returns & Exchanges",
            icon: <Shield className="w-6 h-6" />,
            questions: [
                {
                    question: "Do you have a return or exchange policy?",
                    answer: "Currently, we do not offer returns or exchanges on our products due to hygiene and safety reasons, as these are personal care items. We ensure high-quality products and provide detailed descriptions to help you make the right choice."
                },
                {
                    question: "What if I receive a damaged or defective product?",
                    answer: "If you receive a damaged or defective product, please contact our customer support team within 48 hours of delivery with opening package of the product. We'll investigate and provide appropriate solutions, which may include replacement or refund."
                },
                {
                    question: "What if I ordered the wrong product?",
                    answer: "Since we don't have a return policy, please double-check your orders before confirming. Our customer support team is available to help you choose the right products and answer any questions before you purchase."
                }
            ]
        },
        {
            title: "Product Information",
            icon: <Star className="w-6 h-6" />,
            questions: [
                {
                    question: "Are your products natural and organic?",
                    answer: "Yes! All Panisho products are made with carefully selected natural ingredients. We prioritize using organic and natural components that are gentle on your skin and hair while being effective."
                },
                {
                    question: "Are your products cruelty-free?",
                    answer: "Absolutely! Panisho is committed to being 100% cruelty-free. We never test our products on animals and do not work with suppliers who engage in animal testing."
                },
                {
                    question: "Do your products have an expiry date?",
                    answer: "Yes, all our products have expiry dates printed on the packaging. We recommend using products within the specified timeframe for optimal effectiveness and safety. Store products in a cool, dry place."
                },
                {
                    question: "Can I use multiple Panisho products together?",
                    answer: "Yes! Our products are designed to work harmoniously together. You can create a complete beauty and hair care routine using multiple Panisho products. If you have specific concerns, our customer support team can help design a routine for you."
                },
                {
                    question: "Are your products safe for pregnant and breastfeeding women?",
                    answer: "While our products use natural ingredients, we recommend consulting with your healthcare provider before using any new beauty or hair care products during pregnancy or breastfeeding."
                }
            ]
        },
        {
            title: "Account & Support",
            icon: <HelpCircle className="w-6 h-6" />,
            questions: [
                {
                    question: "How can I contact customer support?",
                    answer: "You can reach our customer support team through phone, or email. We're available to help with any questions about products, orders, or general inquiries. Our team typically responds within 24 hours."
                },
                {
                    question: "Do I need to create an account to place an order?",
                    answer: "While you can place orders without creating an account, we recommend creating one to track your orders, save your preferences, and receive exclusive offers and updates about new products."
                },
                {
                    question: "How do I stay updated about new products and offers?",
                    answer: "Follow us on social media, subscribe to our newsletter, or create an account on our website to receive updates about new product launches, special offers, and beauty tips."
                },
                {
                    question: "Can I get personalized product recommendations?",
                    answer: "Yes! Our customer support team can provide personalized product recommendations based on your skin type, hair type, and specific concerns. Just reach out to us with your requirements."
                },
                {
                    question: "Do you offer bulk or wholesale orders?",
                    answer: "Yes, we do accept bulk orders. Please contact our customer support team directly to discuss pricing, minimum order quantities, and special arrangements for bulk purchases."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="bg-gradient-to-br from-pink-200 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
                                <HelpCircle className="w-10 h-10 text-rose-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            Frequently Asked <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Questions</span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Find answers to common questions about Panisho's premium beauty & hair care products,
                            shipping, and our services.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* FAQ Content */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    
                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Globe className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">Pan-India</div>
                            <div className="text-sm text-gray-600">Delivery Available</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Package className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">₹499+</div>
                            <div className="text-sm text-gray-600">Free Shipping</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Heart className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">100%</div>
                            <div className="text-sm text-gray-600">Natural Products</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                            <Phone className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-800">24/7</div>
                            <div className="text-sm text-gray-600">Customer Support</div>
                        </div>
                    </div>

                    {/* FAQ Categories */}
                    <div className="space-y-8">
                        {faqCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg border border-rose-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-8 py-6 border-b border-rose-200">
                                    <div className="flex items-center">
                                        <div className="text-rose-500 mr-4">
                                            {category.icon}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
                                    </div>
                                </div>
                                
                                <div className="divide-y divide-gray-100">
                                    {category.questions.map((faq, questionIndex) => {
                                        const globalIndex = categoryIndex * 100 + questionIndex;
                                        const isOpen = openIndex === globalIndex;
                                        
                                        return (
                                            <div key={questionIndex} className="px-8 py-6">
                                                <button
                                                    onClick={() => toggleAccordion(globalIndex)}
                                                    className="flex justify-between items-center w-full text-left group"
                                                >
                                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-rose-600 transition-colors duration-200 pr-4">
                                                        {faq.question}
                                                    </h3>
                                                    <div className="flex-shrink-0">
                                                        {isOpen ? (
                                                            <ChevronUp className="w-5 h-5 text-rose-500" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors duration-200" />
                                                        )}
                                                    </div>
                                                </button>
                                                
                                                {isOpen && (
                                                    <div className="mt-4 pr-8">
                                                        <p className="text-gray-700 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Support Section */}
                    <div className="mt-16 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Still Have Questions?</h3>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Can't find the answer you're looking for? Our friendly customer support team is here to help! 
                                Reach out to us and we'll get back to you as soon as possible.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                              <Link to='/contact'>
                                <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contact Support
                                </button>
                                </Link>
                            </div>
                            <div className="mt-6 space-y-2 text-gray-700">
                                <p><strong>Email:</strong> Support@panisho.com</p>
                                <p><strong>WhatsApp:</strong> +91 8160467524</p>
                                <p><strong>Response Time:</strong> Within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;