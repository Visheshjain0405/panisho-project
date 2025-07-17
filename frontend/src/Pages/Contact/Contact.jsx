import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, FileText } from 'lucide-react';
import api from '../../api/axiosInstance';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/contact', formData);
      console.log('Form submitted:', response.data);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const getInputStyle = (field) => {
    return `mt-1 block w-full rounded-md shadow-sm sm:text-sm p-3 transition-all duration-300 border-2 
    ${focused === field ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'} 
    focus:outline-none bg-white bg-opacity-80 backdrop-blur-sm`;
  };

  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    const map = L.map(mapContainer).setView([21.1950, 72.8480], 15); // Updated to Udhana, Surat coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([21.1950, 72.8480]).addTo(map)
      .bindPopup('Panisho Office<br>31 Reva Nagar, Near South Zone Office<br>Udhana, Surat, Gujarat 394210')
      .openPopup();

    // Debugging: Log to confirm marker is added
    console.log('Marker added:', marker);

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-start">
        <div className="w-full max-w-6xl bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-gradient-to-br from-pink-500 to-pink-600 p-8 text-white relative overflow-hidden text-left">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10">
                      <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                </svg>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                <div className="space-y-6 mb-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white text-opacity-80">Mobile Number</p>
                      <p className="font-medium text-lg">+91 8160467524</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white text-opacity-80">Email</p>
                      <p className="font-medium text-lg">Support@panisho.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white text-opacity-80">Address</p>
                      <p className="font-medium">
                        31 Reva Nagar<br />
                        Near South Zone Office<br />
                        Udhana, Surat, Gujarat 394210
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-white border-opacity-20">
                  <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-opacity-80">Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-opacity-80">Saturday:</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-opacity-80">Sunday:</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 p-8 text-left">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Send Us a Message</h2>
                <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you as soon as possible</p>
              </div>
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-100 rounded-xl p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700 text-lg">Your message has been successfully sent. We will contact you very soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {error && (
                    <div className="">
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        className={`${getInputStyle('name')} pl-10`}
                      />
                      <div className={`absolute -bottom-0.5 left-0 h-0.5 bg-pink-500 transition-all duration-300 ${focused === 'name' ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        className={`${getInputStyle('email')} pl-10`}
                      />
                      <div className={`absolute -bottom-0.5 left-0 h-0.5 bg-pink-500 transition-all duration-300 ${focused === 'email' ? 'w-full' : 'w-0'}`}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      className={`${getInputStyle('subject')} pl-10`}
                    />
                    <div className={`absolute -bottom-0.5 left-0 h-0.5 bg-pink-500 transition-all duration-300 ${focused === 'subject' ? 'w-full' : 'w-0'}`}></div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      className={`${getInputStyle('message')} pl-10 resize-none`}
                    />
                    <div className={`absolute -bottom-0.5 left-0 h-0.5 bg-pink-500 transition-all duration-300 ${focused === 'message' ? 'w-full' : 'w-0'}`}></div>
                  </div>
                  <div>
                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        <span>Send Message</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div ref={mapRef} id="map" className="w-full h-96 mt-8 sm:h-64"></div>
      </div>
    </div>
  );
}