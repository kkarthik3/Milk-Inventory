import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  MapPin, 
  Settings, 
  BarChart3,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import CustomerManagement from './CustomerManagement';
import OrderAnalytics from './OrderAnalytics';
import WorkerManagement from './WorkerManagement';
import InventoryManagement from './InventoryManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'workers', name: 'Workers', icon: MapPin },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Total Customers', value: '245', change: '+12%', color: 'bg-blue-500' },
    { label: 'Active Workers', value: '8', change: '+2', color: 'bg-green-500' },
    { label: 'Today Orders', value: '156', change: '+8%', color: 'bg-purple-500' },
    { label: 'Monthly Revenue', value: '₹45,230', change: '+15%', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards - Only show on overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 mb-8">
          <div className="flex space-x-1 p-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-3 px-4 rounded-xl transition-all whitespace-nowrap
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
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'workers' && <WorkerManagement />}
          {activeTab === 'inventory' && <InventoryManagement />}
          {activeTab === 'analytics' && <OrderAnalytics />}
          {activeTab === 'settings' && <SettingsContent />}
        </div>
      </div>
    </div>
  );
};

const OverviewContent: React.FC = () => {
  const recentOrders = [
    { id: 1, customer: 'John Doe', milk: 'Aavin Green', quantity: '2L', status: 'Delivered', amount: '₹56' },
    { id: 2, customer: 'Jane Smith', milk: 'Aavin Blue', quantity: '1L', status: 'Pending', amount: '₹26' },
    { id: 3, customer: 'Bob Wilson', milk: 'Buttermilk', quantity: '3L', status: 'Delivered', amount: '₹45' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{order.customer}</p>
                <p className="text-sm text-gray-600">{order.quantity} {order.milk}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{order.amount}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Workers */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Top Performing Workers</h3>
          <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: 'Raj Kumar', route: 'Route A', deliveries: 45, rating: 4.9 },
            { name: 'Suresh Singh', route: 'Route B', deliveries: 42, rating: 4.8 },
            { name: 'Amit Patel', route: 'Route C', deliveries: 38, rating: 4.7 }
          ].map((worker, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{worker.name}</p>
                <p className="text-sm text-gray-600">{worker.route}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{worker.deliveries} orders</p>
                <p className="text-sm text-yellow-600">★ {worker.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsContent: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input 
              type="text" 
              defaultValue="MilkFlow Delivery"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input 
              type="tel" 
              defaultValue="+91 9876543210"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
            <textarea 
              defaultValue="123 Business Park, Chennai - 600001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              rows={3}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span className="text-gray-700">Email notifications for new orders</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span className="text-gray-700">SMS alerts for delivery updates</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span className="text-gray-700">WhatsApp integration</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;