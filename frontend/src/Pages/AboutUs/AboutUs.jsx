import React from 'react';
import { Heart, Leaf, Award, Users, ShoppingBag, Star, CheckCircle, Shield, Truck, Phone, Globe, Box, Clock } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-24 overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="inline-block bg-gradient-to-r from-rose-100 to-pink-100 backdrop-blur-sm rounded-full px-6 py-3 text-rose-800 font-semibold text-sm uppercase tracking-wide border border-rose-200">
                                Premium Beauty & Wellness
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                            About <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Panisho</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                            Your trusted destination for premium beauty & hair care products.
                            We believe in nurturing your natural beauty with carefully curated, high-quality beauty and hair care solutions.
                        </p>
                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-full px-6 py-3 text-gray-800 font-semibold border border-rose-200 shadow-sm">
                                <Leaf className="inline w-5 h-5 mr-2 text-green-600" />
                                100% Natural
                            </div>
                            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-full px-6 py-3 text-gray-800 font-semibold border border-rose-200 shadow-sm">
                                <Award className="inline w-5 h-5 mr-2 text-yellow-600" />
                                Premium Quality
                            </div>
                            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-full px-6 py-3 text-gray-800 font-semibold border border-rose-200 shadow-sm">
                                <Heart className="inline w-5 h-5 mr-2 text-rose-600" />
                                Cruelty Free
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Our Story Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Story</h2>
                            <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-8"></div>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Discover how Panisho became a trusted name in beauty & hair care
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-100">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                            <Star className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">The Beginning</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        Panisho was born from a simple belief: everyone deserves access to high-quality,
                                        natural beauty and hair care products that enhance their natural beauty
                                        and well-being. Our founders recognized the gap in the market for premium,
                                        yet accessible beauty and hair care solutions.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-100">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                            <Shield className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">The Research</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        Our journey began with extensive research into the finest ingredients and
                                        formulations that work in harmony with your skin and hair. We traveled the world,
                                        collaborating with beauty experts, hair care specialists, and sourcing the purest ingredients.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-100">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                            <CheckCircle className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Today</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        Today, Panisho stands as a trusted name in the beauty and hair care industry,
                                        serving thousands of satisfied customers worldwide. We continue to innovate
                                        and expand our beauty & hair care product range while maintaining our commitment to quality and excellence.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-8 h-full border border-rose-200">
                                    <div className="text-center">
                                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-rose-100">
                                            <Heart className="text-rose-500 w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
                                        <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                            To provide premium, natural beauty and hair care solutions that
                                            enhance your daily beauty routine and promote healthy, radiant skin and beautiful hair for everyone.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-rose-100">
                                                <Users className="text-rose-500 w-8 h-8 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-800">50K+</div>
                                                <div className="text-sm text-gray-600">Happy Customers</div>
                                            </div>
                                            <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-rose-100">
                                                <Box className="text-rose-500 w-8 h-8 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-800">100+</div>
                                                <div className="text-sm text-gray-600">Premium Products</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Timeline Section */}
            <div className="py-20 bg-gradient-to-br from-rose-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Journey</h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From initial concept to launching our trusted beauty brand
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-rose-300 to-pink-500"></div>

                            {[
                                {
                                    year: "Jan 2025",
                                    title: "Business Concept",
                                    description: "Started conceptualizing Panisho with a vision to create premium beauty and hair care products that combine natural ingredients with modern innovation.",
                                    icon: <Leaf className="w-6 h-6" />,
                                    position: "left"
                                },
                                {
                                    year: "Mar 2025",
                                    title: "Market Research",
                                    description: "Conducted extensive market research to understand customer needs and identify gaps in the beauty and hair care industry.",
                                    icon: <Shield className="w-6 h-6" />,
                                    position: "right"
                                },
                                {
                                    year: "May 2025",
                                    title: "Product Development",
                                    description: "Began developing our signature formulations, focusing on natural ingredients and effective results for both beauty and hair care.",
                                    icon: <Star className="w-6 h-6" />,
                                    position: "left"
                                },
                                {
                                    year: "Jun 2025",
                                    title: "Quality Testing",
                                    description: "Rigorous testing phase to ensure all products meet our high standards for safety, efficacy, and customer satisfaction.",
                                    icon: <CheckCircle className="w-6 h-6" />,
                                    position: "right"
                                },
                                {
                                    year: "Jul 2025",
                                    title: "Official Launch",
                                    description: "Officially launched Panisho website and product line, introducing our premium collection of beauty and hair care products to the world.",
                                    icon: <ShoppingBag className="w-6 h-6" />,
                                    position: "left"
                                }
                            ].map((milestone, index) => (
                                <div key={index} className={`flex items-center mb-16 ${milestone.position === 'right' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-1/2 ${milestone.position === 'right' ? 'pl-8' : 'pr-8'}`}>
                                        <div className={`bg-white rounded-2xl p-8 shadow-lg border border-rose-200 ${milestone.position === 'right' ? 'text-right' : ''}`}>
                                            <div className="text-rose-600 font-bold text-lg mb-2">{milestone.year}</div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{milestone.title}</h3>
                                            <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                        <div className="text-white">
                                            {milestone.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Products Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Premium Collection</h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our comprehensive range of premium beauty & hair care products
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Face Wash",
                                icon: <Shield className="w-8 h-8" />,
                                description: "Gentle cleansing for all skin types with natural ingredients",
                                gradient: "from-rose-50 to-pink-50"
                            },
                            {
                                name: "Face Serum",
                                icon: <Star className="w-8 h-8" />,
                                description: "Advanced anti-aging and hydrating serums",
                                gradient: "from-pink-50 to-purple-50"
                            },
                            {
                                name: "Baby Care",
                                icon: <Heart className="w-8 h-8" />,
                                description: "Ultra-gentle products for delicate baby skin",
                                gradient: "from-rose-50 to-pink-50"
                            },
                            {
                                name: "Beard Oil",
                                icon: <Leaf className="w-8 h-8" />,
                                description: "Premium grooming oils for healthy beard growth",
                                gradient: "from-pink-50 to-purple-50"
                            },
                            {
                                name: "Conditioner",
                                icon: <CheckCircle className="w-8 h-8" />,
                                description: "Deep nourishing hair conditioning treatments",
                                gradient: "from-rose-50 to-pink-50"
                            },
                            {
                                name: "Shampoo",
                                icon: <Users className="w-8 h-8" />,
                                description: "Sulfate-free formulas for healthy hair",
                                gradient: "from-pink-50 to-purple-50"
                            },
                            {
                                name: "Sunscreen",
                                icon: <Shield className="w-8 h-8" />,
                                description: "Broad-spectrum UV protection with SPF 50+",
                                gradient: "from-rose-50 to-pink-50"
                            },
                            {
                                name: "Wellness",
                                icon: <Award className="w-8 h-8" />,
                                description: "Complete wellness and self-care solutions",
                                gradient: "from-pink-50 to-purple-50"
                            }
                        ].map((product, index) => (
                            <div key={index} className="group">
                                <div className={`bg-gradient-to-br ${product.gradient} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-rose-200`}>
                                    <div className="text-center">
                                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 border border-rose-100">
                                            <div className="text-rose-500">
                                                {product.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-20 bg-gradient-to-br from-rose-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-800 mb-6">Why Choose Panisho?</h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover what sets us apart in the beauty & hair care industry
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Leaf className="w-8 h-8" />,
                                title: "Natural Ingredients",
                                description: "We carefully select natural, skin-friendly ingredients that work harmoniously with your skin type.",
                                color: "text-green-600"
                            },
                            {
                                icon: <Award className="w-8 h-8" />,
                                title: "Premium Quality",
                                description: "Every product meets our rigorous quality standards and undergoes extensive testing before launch.",
                                color: "text-yellow-600"
                            },
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: "Expert Formulation",
                                description: "Our products are developed by skincare experts and dermatologists for maximum effectiveness.",
                                color: "text-blue-600"
                            },
                            {
                                icon: <CheckCircle className="w-8 h-8" />,
                                title: "Trusted Brand",
                                description: "Backed by thousands of positive reviews and a commitment to customer satisfaction.",
                                color: "text-purple-600"
                            },
                            {
                                icon: <Clock className="w-8 h-8" />,
                                title: "Innovative Formulas",
                                description: "Cutting-edge formulations that combine traditional wisdom with modern science.",
                                color: "text-indigo-600"
                            },
                            {
                                icon: <Truck className="w-8 h-8" />,
                                title: "Fast Delivery",
                                description: "Quick and secure shipping with careful packaging to ensure product integrity.",
                                color: "text-red-600"
                            },
                            {
                                icon: <Phone className="w-8 h-8" />,
                                title: "24/7 Support",
                                description: "Our dedicated customer support team is always ready to help with your queries.",
                                color: "text-rose-600"
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: "Eco-Friendly",
                                description: "Committed to sustainable packaging and environmentally responsible practices.",
                                color: "text-green-600"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-rose-200">
                                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-rose-100">
                                        <div className={feature.color}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Core Values</h2>
                            <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-8"></div>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                The principles that guide everything we do at Panisho
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-rose-200">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                                    <Heart className="text-rose-500 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Compassionate Care</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We genuinely care about your skin health and beauty journey, providing products
                                    that nurture, protect, and enhance your natural beauty with love and attention.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-rose-200">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                                    <Star className="text-rose-500 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Excellence</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We strive for excellence in every aspect of our business, from product formulation
                                    to customer service, ensuring you receive only the highest quality products and experience.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-rose-200">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                                    <Shield className="text-rose-500 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Trust & Integrity</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Building lasting relationships with our customers through transparency, honesty,
                                    and reliable service. Your trust is our most valuable asset.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-20 w-40 h-40 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-20 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-xl"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-pink-200 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-4 border-white">
                            <Heart className="w-10 h-10 text-rose-600" />
                        </div>

                        <h2 className="text-5xl font-bold mb-6 text-gray-800">
                            Ready to Transform Your Beauty Routine?
                        </h2>
                        <p className="text-xl mb-8 text-gray-700 leading-relaxed">
                            Join thousands of satisfied customers who have discovered the Panisho difference.
                            Your journey to healthier, more radiant skin and beautiful hair starts here with our premium collection
                            of natural beauty & hair care products.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center border-2 border-transparent hover:border-white">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Shop Now
                            </button>
                            <button className="bg-white border-2 border-rose-300 text-rose-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white hover:border-transparent shadow-lg hover:shadow-xl hover:scale-105 flex items-center">
                                <Phone className="w-5 h-5 mr-2" />
                                Contact Us
                            </button>
                        </div>

                        <div className="mt-12 flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                            <div className="w-3 h-3 bg-rose-300 rounded-full"></div>
                            <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-rose-300 rounded-full"></div>
                            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;