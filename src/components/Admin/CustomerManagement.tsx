import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';
import { User } from '../../types';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([
    {
      _id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'customer',
      phone: '+91 9876543210',
      address: '123 Main Street, Chennai',
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      role: 'customer',
      phone: '+91 9876543211',
      address: '456 Oak Avenue, Chennai',
      createdAt: new Date('2024-02-20')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const deleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c._id !== customerId));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        <div className="flex items-center space-x-3">
          <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-medium text-gray-700">Customer</th>
              <th className="text-left py-4 px-4 font-medium text-gray-700">Contact</th>
              <th className="text-left py-4 px-4 font-medium text-gray-700">Address</th>
              <th className="text-left py-4 px-4 font-medium text-gray-700">Joined</th>
              <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{customer.phone}</td>
                <td className="py-4 px-4 text-gray-600">{customer.address}</td>
                <td className="py-4 px-4 text-gray-600">
                  {customer.createdAt.toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {(showAddModal || editingCustomer) && (
        <CustomerModal
          customer={editingCustomer}
          onSave={(customerData) => {
            if (editingCustomer) {
              setCustomers(prev => prev.map(c => 
                c._id === editingCustomer._id 
                  ? { ...editingCustomer, ...customerData }
                  : c
              ));
            } else {
              const newCustomer: User = {
                _id: Math.random().toString(),
                ...customerData,
                role: 'customer' as const,
                createdAt: new Date()
              };
              setCustomers(prev => [...prev, newCustomer]);
            }
            setShowAddModal(false);
            setEditingCustomer(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
};

interface CustomerModalProps {
  customer: User | null;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || ''
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
            {customer ? 'Edit Customer' : 'Add New Customer'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              rows={3}
            />
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
              {customer ? 'Update' : 'Add'} Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagement;