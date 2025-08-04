import React, { useState } from 'react';
import { MapPin, Package, CheckCircle, XCircle, Clock, Navigation } from 'lucide-react';
import { Booking } from '../../types';

const WorkerDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveries, setDeliveries] = useState<Booking[]>([
    {
      _id: '1',
      customerId: '1',
      customerName: 'John Doe',
      customerAddress: '123 Main Street, Apartment 4B',
      date: new Date(),
      milkType: 'Aavin Green',
      quantity: 2,
      isExtra: false,
      status: 'pending',
      routeId: 'route1',
      workerId: 'worker1',
      createdAt: new Date()
    },
    {
      _id: '2',
      customerId: '2',
      customerName: 'Jane Smith',
      customerAddress: '456 Oak Avenue, House 12',
      date: new Date(),
      milkType: 'Aavin Blue',
      quantity: 1,
      isExtra: true,
      status: 'pending',
      routeId: 'route1',
      workerId: 'worker1',
      createdAt: new Date()
    }
  ]);

  const updateDeliveryStatus = (deliveryId: string, status: 'delivered' | 'missed') => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery._id === deliveryId 
          ? { ...delivery, status }
          : delivery
      )
    );
  };

  const todayDeliveries = deliveries.filter(delivery => 
    new Date(delivery.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const stats = {
    total: todayDeliveries.length,
    delivered: todayDeliveries.filter(d => d.status === 'delivered').length,
    pending: todayDeliveries.filter(d => d.status === 'pending').length,
    missed: todayDeliveries.filter(d => d.status === 'missed').length
  };

  const getMilkColor = (milkType: string) => {
    const colorMap: { [key: string]: string } = {
      'Aavin Green': 'bg-green-500',
      'Aavin Blue': 'bg-blue-500',
      'Aavin Orange': 'bg-orange-500',
      'Aavin Purple': 'bg-purple-500',
      'Aavin Pink': 'bg-pink-500',
      'Buttermilk': 'bg-yellow-500'
    };
    return colorMap[milkType] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Route Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Route A - Sector 1</h1>
              <p className="text-gray-600">Today's Delivery Schedule</p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Navigate Route</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Missed</p>
                <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Deliveries</h2>
          
          <div className="space-y-4">
            {todayDeliveries.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full ${getMilkColor(delivery.milkType)} mt-1`}></div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{delivery.customerName}</h3>
                        {delivery.isExtra && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                            Extra
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'missed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{delivery.customerAddress}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{delivery.quantity}L {delivery.milkType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {delivery.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDeliveryStatus(delivery._id, 'delivered')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Delivered</span>
                        </button>
                        <button
                          onClick={() => updateDeliveryStatus(delivery._id, 'missed')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Missed</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {todayDeliveries.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Deliveries Today</h3>
                <p className="text-gray-600">Select a different date to view scheduled deliveries</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;