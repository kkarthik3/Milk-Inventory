import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Package } from 'lucide-react';

const OrderAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');

  const dailyOrders = [
    { date: 'Mon', orders: 45, revenue: 1260 },
    { date: 'Tue', orders: 52, revenue: 1456 },
    { date: 'Wed', orders: 38, revenue: 1064 },
    { date: 'Thu', orders: 61, revenue: 1708 },
    { date: 'Fri', orders: 49, revenue: 1372 },
    { date: 'Sat', orders: 67, revenue: 1876 },
    { date: 'Sun', orders: 43, revenue: 1204 }
  ];

  const milkTypeData = [
    { name: 'Aavin Green', value: 35, color: '#10B981' },
    { name: 'Aavin Blue', value: 25, color: '#3B82F6' },
    { name: 'Aavin Orange', value: 20, color: '#F97316' },
    { name: 'Aavin Purple', value: 10, color: '#8B5CF6' },
    { name: 'Aavin Pink', value: 7, color: '#EC4899' },
    { name: 'Buttermilk', value: 3, color: '#EAB308' }
  ];

  const routePerformance = [
    { route: 'Route A', deliveries: 156, success: 95, customer: 45 },
    { route: 'Route B', deliveries: 142, success: 92, customer: 38 },
    { route: 'Route C', deliveries: 128, success: 89, customer: 32 }
  ];

  const monthlyTrend = [
    { month: 'Jan', orders: 1200, revenue: 33600 },
    { month: 'Feb', orders: 1350, revenue: 37800 },
    { month: 'Mar', orders: 1180, revenue: 33040 },
    { month: 'Apr', orders: 1420, revenue: 39760 },
    { month: 'May', orders: 1520, revenue: 42560 },
    { month: 'Jun', orders: 1380, revenue: 38640 }
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Analytics</h2>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Orders</p>
                <p className="text-2xl font-bold">355</p>
                <p className="text-sm text-blue-100">+12% from last week</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Revenue</p>
                <p className="text-2xl font-bold">₹9,940</p>
                <p className="text-sm text-green-100">+8% from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold">₹28</p>
                <p className="text-sm text-purple-100">-2% from last week</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Success Rate</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-orange-100">+3% from last week</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Orders Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Orders & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milk Types Distribution */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Milk Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={milkTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {milkTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Performance</h3>
          <div className="space-y-4">
            {routePerformance.map((route, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{route.route}</h4>
                  <span className="text-sm text-gray-600">{route.customer} customers</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Deliveries</p>
                    <p className="text-lg font-bold text-gray-900">{route.deliveries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-lg font-bold text-green-600">{route.success}%</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${route.success}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Spent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Favorite Milk</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', orders: 28, spent: 784, favorite: 'Aavin Green', lastOrder: '2 days ago' },
                { name: 'Jane Smith', orders: 25, spent: 650, favorite: 'Aavin Blue', lastOrder: '1 day ago' },
                { name: 'Bob Wilson', orders: 22, spent: 616, favorite: 'Buttermilk', lastOrder: 'Today' }
              ].map((customer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="py-3 px-4 text-gray-600">{customer.orders}</td>
                  <td className="py-3 px-4 text-gray-600">₹{customer.spent}</td>
                  <td className="py-3 px-4 text-gray-600">{customer.favorite}</td>
                  <td className="py-3 px-4 text-gray-600">{customer.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;