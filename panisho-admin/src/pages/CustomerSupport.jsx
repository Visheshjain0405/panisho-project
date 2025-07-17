import React, { useState, useEffect } from 'react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
import Header from '../component/common/Header';

function CustomerSupport() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  // Fetch contact form submissions
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact');
      setContacts(response.data);
    } catch (error) {
      setError('Error fetching contacts: ' + error.message);
      console.error('Error fetching contacts:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-auto"> {/* Adjusted margin-left to account for sidebar width */}
        <Header />

        {/* Contact Submissions Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact Form Data</h2>
          {error && (
            <div className="mb-4 p-2 rounded bg-red-100 text-red-800">
              {error}
            </div>
          )}
          {contacts.length === 0 && !error ? (
            <p className="text-gray-700">No contact submissions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2 text-left text-gray-900">Name</th>
                    <th className="border border-gray-300 p-2 text-left text-gray-900">Email</th>
                    <th className="border border-gray-300 p-2 text-left text-gray-900">Subject</th>
                    <th className="border border-gray-300 p-2 text-left text-gray-900">Message</th>
                    <th className="border border-gray-300 p-2 text-left text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2 text-gray-900">{contact.name}</td>
                      <td className="border border-gray-300 p-2 text-gray-900">{contact.email}</td>
                      <td className="border border-gray-300 p-2 text-gray-900">{contact.subject}</td>
                      <td className="border border-gray-300 p-2 text-gray-900">{contact.message}</td>
                      <td className="border border-gray-300 p-2 text-gray-900">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerSupport;