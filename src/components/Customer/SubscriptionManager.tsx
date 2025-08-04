import React, { useState } from 'react';
import { Plus, Edit, Pause, Play, Trash2, Calendar } from 'lucide-react';
import { MonthlySubscription, MilkVariety } from '../../types';

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<MonthlySubscription[]>([
    {
      _id: '1',
      customerId: '1',
      milkType: 'Aavin Green',
      quantity: 2,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      pausedDates: []
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const milkVarieties: MilkVariety[] = [
    { _id: '1', name: 'Aavin Green', color: 'bg-green-500', pricePerLiter: 28, stock: 100, description: 'Full cream milk' },
    { _id: '2', name: 'Aavin Blue', color: 'bg-blue-500', pricePerLiter: 26, stock: 100, description: 'Toned milk' },
    { _id: '3', name: 'Aavin Orange', color: 'bg-orange-500', pricePerLiter: 24, stock: 100, description: 'Standardized milk' },
    { _id: '4', name: 'Aavin Purple', color: 'bg-purple-500', pricePerLiter: 22, stock: 100, description: 'Slim milk' },
    { _id: '5', name: 'Aavin Pink', color: 'bg-pink-500', pricePerLiter: 20, stock: 100, description: 'Double toned milk' },
    { _id: '6', name: 'Buttermilk', color: 'bg-yellow-500', pricePerLiter: 15, stock: 100, description: 'Fresh buttermilk' }
  ];

  const getMilkVariety = (milkType: string) => {
    return milkVarieties.find(variety => variety.name === milkType);
  };

  const toggleSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub._id === subscriptionId 
          ? { ...sub, isActive: !sub.isActive }
          : sub
      )
    );
  };

  const deleteSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.filter(sub => sub._id !== subscriptionId));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Monthly Subscriptions</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Subscription</span>
        </button>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => {
          const milkVariety = getMilkVariety(subscription.milkType);
          const monthlyPrice = (milkVariety?.pricePerLiter || 0) * subscription.quantity * 30;
          
          return (
            <div key={subscription._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${milkVariety?.color || 'bg-gray-300'}`}></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscription.milkType} - {subscription.quantity}L Daily
                    </h3>
                    <p className="text-sm text-gray-600">
                      Monthly Cost: ₹{monthlyPrice} | Active until {subscription.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.isActive ? 'Active' : 'Paused'}
                  </div>

                  <button
                    onClick={() => toggleSubscription(subscription._id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {subscription.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteSubscription(subscription._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {subscription.pausedDates.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Paused on {subscription.pausedDates.length} days this month
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscriptions</h3>
            <p className="text-gray-600">Create a monthly subscription to ensure regular milk delivery</p>
          </div>
        )}
      </div>

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <CreateSubscriptionModal
          milkVarieties={milkVarieties}
          onSave={(data) => {
            const newSubscription: MonthlySubscription = {
              _id: Math.random().toString(),
              customerId: '1',
              milkType: data.milkType,
              quantity: data.quantity,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              isActive: true,
              pausedDates: []
            };
            setSubscriptions(prev => [...prev, newSubscription]);
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

interface CreateSubscriptionModalProps {
  milkVarieties: MilkVariety[];
  onSave: (data: any) => void;
  onClose: () => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({ milkVarieties, onSave, onClose }) => {
  const [selectedMilk, setSelectedMilk] = useState(milkVarieties[0].name);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(30);

  const selectedVariety = milkVarieties.find(v => v.name === selectedMilk);
  const totalPrice = (selectedVariety?.pricePerLiter || 0) * quantity * duration;
  const endDate = new Date(new Date(startDate).getTime() + duration * 24 * 60 * 60 * 1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      milkType: selectedMilk,
      quantity,
      startDate,
      endDate: endDate.toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Monthly Subscription</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Milk Variety</label>
            <select
              value={selectedMilk}
              onChange={(e) => setSelectedMilk(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {milkVarieties.map((variety) => (
                <option key={variety._id} value={variety.name}>
                  {variety.name} - ₹{variety.pricePerLiter}/L
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Quantity (Liters)</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Cost:</span>
              <span className="text-lg font-bold text-blue-600">₹{totalPrice}</span>
            </div>
            <p className="text-xs text-gray-500">
              Subscription ends on {endDate.toLocaleDateString()}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Create Subscription
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionManager;