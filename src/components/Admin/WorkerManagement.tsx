import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, User } from 'lucide-react';
import { User as UserType, Route } from '../../types';

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<UserType[]>([
    {
      _id: '1',
      email: 'raj@milkdelivery.com',
      name: 'Raj Kumar',
      role: 'worker',
      phone: '+91 9876543210',
      routeId: 'route1',
      createdAt: new Date('2024-01-10')
    },
    {
      _id: '2',
      email: 'suresh@milkdelivery.com',
      name: 'Suresh Singh',
      role: 'worker',
      phone: '+91 9876543211',
      routeId: 'route2',
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [routes] = useState<Route[]>([
    { _id: 'route1', name: 'Route A - Sector 1', workerId: '1', workerName: 'Raj Kumar', areas: ['Anna Nagar', 'T. Nagar'], customerCount: 45 },
    { _id: 'route2', name: 'Route B - Sector 2', workerId: '2', workerName: 'Suresh Singh', areas: ['Adyar', 'Velachery'], customerCount: 38 },
    { _id: 'route3', name: 'Route C - Sector 3', workerId: '', workerName: '', areas: ['Tambaram', 'Chrompet'], customerCount: 32 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<UserType | null>(null);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkerRoute = (routeId?: string) => {
    return routes.find(route => route._id === routeId);
  };

  const deleteWorker = (workerId: string) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      setWorkers(prev => prev.filter(w => w._id !== workerId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Workers Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Worker Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Worker</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-700">Worker</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Assigned Route</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Performance</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => {
                const route = getWorkerRoute(worker.routeId);
                return (
                  <tr key={worker._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{worker.name}</p>
                          <p className="text-sm text-gray-600">{worker.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{worker.phone}</td>
                    <td className="py-4 px-4">
                      {route ? (
                        <div>
                          <p className="font-medium text-gray-900">{route.name}</p>
                          <p className="text-sm text-gray-600">{route.customerCount} customers</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No route assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingWorker(worker)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteWorker(worker._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routes Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Routes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div key={route._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Assigned Worker:</p>
                  <p className="font-medium text-gray-900">
                    {route.workerName || 'Unassigned'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Areas:</p>
                  <p className="text-sm text-gray-900">{route.areas.join(', ')}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Customers:</p>
                  <p className="font-semibold text-blue-600">{route.customerCount}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Manage Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Worker Modal */}
      {(showAddModal || editingWorker) && (
        <WorkerModal
          worker={editingWorker}
          routes={routes}
          onSave={(workerData) => {
            if (editingWorker) {
              setWorkers(prev => prev.map(w => 
                w._id === editingWorker._id 
                  ? { ...editingWorker, ...workerData }
                  : w
              ));
            } else {
              const newWorker: UserType = {
                _id: Math.random().toString(),
                ...workerData,
                role: 'worker' as const,
                createdAt: new Date()
              };
              setWorkers(prev => [...prev, newWorker]);
            }
            setShowAddModal(false);
            setEditingWorker(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingWorker(null);
          }}
        />
      )}
    </div>
  );
};

interface WorkerModalProps {
  worker: UserType | null;
  routes: Route[];
  onSave: (data: Partial<UserType>) => void;
  onClose: () => void;
}

const WorkerModal: React.FC<WorkerModalProps> = ({ worker, routes, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: worker?.name || '',
    email: worker?.email || '',
    phone: worker?.phone || '',
    routeId: worker?.routeId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {worker ? 'Edit Worker' : 'Add New Worker'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Route</label>
            <select
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a route</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.name} ({route.customerCount} customers)
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              {worker ? 'Update' : 'Add'} Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkerManagement;