import React, { useState } from 'react';
import { Calendar, Package, CreditCard, Bell, User, BarChart3 } from 'lucide-react';
import CalendarBooking from './CalendarBooking';
import SubscriptionManager from './SubscriptionManager';

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    { id: 'calendar', name: 'Book Milk', icon: Calendar },
    { id: 'subscription', name: 'Subscriptions', icon: Package },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const stats = [
    { label: 'This Month Orders', value: '24', color: 'bg-blue-500' },
    { label: 'Total Spent', value: '₹672', color: 'bg-green-500' },
    { label: 'Active Subscriptions', value: '2', color: 'bg-purple-500' },
    { label: 'Next Delivery', value: 'Tomorrow', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 mb-8">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'calendar' && <CalendarBooking />}
          {activeTab === 'subscription' && <SubscriptionManager />}
          {activeTab === 'billing' && <BillingHistory />}
          {activeTab === 'profile' && <ProfileSettings />}
        </div>
      </div>
    </div>
  );
};

const BillingHistory: React.FC = () => {
  const bills = [
    { id: 1, month: 'November 2024', amount: 672, status: 'Paid', date: '2024-11-01' },
    { id: 2, month: 'October 2024', amount: 680, status: 'Paid', date: '2024-10-01' },
    { id: 3, month: 'September 2024', amount: 650, status: 'Paid', date: '2024-09-01' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">{bill.month}</td>
                <td className="py-4 px-4 font-semibold">₹{bill.amount}</td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {bill.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{bill.date}</td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            type="text" 
            defaultValue="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            defaultValue="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input 
            type="tel" 
            defaultValue="+91 9876543210"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
          <textarea 
            defaultValue="123 Main Street, Apartment 4B, Chennai - 600001"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={3}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;