import React from 'react';
import { ShoppingBag, Heart, Leaf } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-white to-pink-50 z-0"></div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl text-pink-700 tracking-tight mb-6">
                        About Panisho
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                        At Panisho, we believe beauty is about confidence and care. Our premium beauty and hair products are crafted to enhance your natural glow and nourish your skin and hair.
                    </p>
                </div>

                {/* Our Story */}
                <div className="flex flex-col lg:flex-row gap-12 mb-20">
                    <div className="lg:w-1/2 bg-white/30 backdrop-blur-lg p-10 rounded-3xl border border-white/50 shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                        <h2 className="text-3xl font-bold text-pink-600 mb-6">Our Story</h2>
                        <p className="text-gray-700 text-lg">
                            Founded with a passion for clean beauty, Panisho is your go-to destination for high-quality beauty and hair care products. We started with a simple mission: to create effective, safe, and cruelty-free products that make you feel beautiful inside and out. From shampoos to sunscreens, every product is designed with love and care.
                        </p>
                    </div>
                    <div className="lg:w-1/2 relative flex items-center justify-center">
                        <img
                            src="https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg"
                            alt="Panisho Beauty Products"
                            className="w-full h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-pink-600/10 rounded-3xl transform hover:scale-105 transition-transform duration-300" aria-hidden="true"></div>
                    </div>
                </div>

                {/* Our Products */}
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-center text-pink-700 mb-12">Our Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Shampoo',
                                desc: 'Gentle cleansing for vibrant, healthy hair.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Shampoo Bottle',
                            },
                            {
                                name: 'Conditioner',
                                desc: 'Nourishes and hydrates for silky-smooth strands.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Conditioner Bottle',
                            },
                            {
                                name: 'Facewash',
                                desc: 'Cleanses deeply for a refreshed, glowing complexion.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Facewash Tube',
                            },
                            {
                                name: 'Face Serum',
                                desc: 'Boosts radiance with potent, skin-loving ingredients.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Face Serum Bottle',
                            },
                            {
                                name: 'Beard Oil',
                                desc: 'Softens and tames for a well-groomed beard.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Beard Oil Bottle',
                            },
                            {
                                name: 'Sunscreen',
                                desc: 'Protects skin with broad-spectrum SPF coverage.',
                                img: 'https://res.cloudinary.com/djh2ro9tm/image/upload/v1747250337/Shubham%20Project/image_2_gbpkqq.jpg',
                                alt: 'Panisho Sunscreen Tube',
                            },
                        ].map((product, index) => (
                            <div
                                key={index}
                                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative mb-4">
                                    <img
                                        src={product.img}
                                        alt={product.alt}
                                        className="w-full h-48 object-cover rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-pink-600/10 rounded-2xl transform hover:scale-105 transition-transform duration-300" aria-hidden="true"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-pink-600 mb-2">{product.name}</h3>
                                <p className="text-gray-700">{product.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-center text-pink-700 mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, title: 'Cruelty-Free', desc: 'No animal testing, ever. We love all creatures.' },
                            { icon: Leaf, title: 'Clean Beauty', desc: 'Safe, non-toxic ingredients for you and the planet.' },
                            { icon: ShoppingBag, title: 'Customer First', desc: 'Your satisfaction is our top priority.' },
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                            >
                                <value.icon className="w-12 h-12 text-pink-600 mx-auto mb-4 animate-pulse" />
                                <h3 className="text-xl font-semibold text-pink-600 mb-3">{value.title}</h3>
                                <p className="text-gray-700">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-white/30 backdrop-blur-lg p-12 rounded-3xl border border-white/50 shadow-2xl">
                    <h2 className="text-3xl font-bold text-pink-600 mb-6">Join the Panisho Family</h2>
                    <p className="text-gray-700 text-lg mb-8">
                        Discover the joy of beauty with Panisho. Shop our collection and elevate your routine today!
                    </p>
                    <a
                        denies href="/shop"
                        className="bg-pink-600 text-white py-3 px-10 rounded-2xl hover:bg-pink-700 transition-all duration-300 inline-flex items-center transform hover:scale-105 shadow-lg"
                    >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Shop Now
                    </a>
                </div>
            </div>

            {/* Custom CSS for Animations */}
            <style jsx>{`
        @keyframes glow {
          0% { text-shadow: 0 0 10px rgba(236, 72, 153, 0.5); }
          50% { text-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
          100% { text-shadow: 0 0 10px rgba(236, 72, 153, 0.5); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default AboutUs;