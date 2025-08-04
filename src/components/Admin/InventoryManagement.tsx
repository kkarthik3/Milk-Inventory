import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { MilkVariety } from '../../types';

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<MilkVariety[]>([
    { _id: '1', name: 'Aavin Green', color: 'bg-green-500', pricePerLiter: 28, stock: 150, description: 'Full cream milk' },
    { _id: '2', name: 'Aavin Blue', color: 'bg-blue-500', pricePerLiter: 26, stock: 75, description: 'Toned milk' },
    { _id: '3', name: 'Aavin Orange', color: 'bg-orange-500', pricePerLiter: 24, stock: 200, description: 'Standardized milk' },
    { _id: '4', name: 'Aavin Purple', color: 'bg-purple-500', pricePerLiter: 22, stock: 25, description: 'Slim milk' },
    { _id: '5', name: 'Aavin Pink', color: 'bg-pink-500', pricePerLiter: 20, stock: 100, description: 'Double toned milk' },
    { _id: '6', name: 'Buttermilk', color: 'bg-yellow-500', pricePerLiter: 15, stock: 80, description: 'Fresh buttermilk' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MilkVariety | null>(null);

  const lowStockItems = inventory.filter(item => item.stock < 50);
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.pricePerLiter), 0);

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item._id === itemId ? { ...item, stock: Math.max(0, newStock) } : item
    ));
  };

  return (
    <div className="space-y-8">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.reduce((sum, item) => sum + item.stock, 0)}L
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Alert</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-red-900">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-4 border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">{item.stock}L remaining</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Price/L</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Stock</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Value</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">₹{item.pricePerLiter}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateStock(item._id, item.stock - 10)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                      >
                        -
                      </button>
                      <span className="font-medium text-gray-900 min-w-[60px] text-center">
                        {item.stock}L
                      </span>
                      <button
                        onClick={() => updateStock(item._id, item.stock + 10)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    ₹{(item.stock * item.pricePerLiter).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.stock < 30 ? 'bg-red-100 text-red-800' :
                      item.stock < 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.stock < 30 ? 'Critical' : item.stock < 50 ? 'Low' : 'Good'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingItem) && (
        <ProductModal
          product={editingItem}
          onSave={(productData) => {
            if (editingItem) {
              setInventory(prev => prev.map(item => 
                item._id === editingItem._id 
                  ? { ...editingItem, ...productData }
                  : item
              ));
            } else {
              const newProduct: MilkVariety = {
                _id: Math.random().toString(),
                ...productData,
                color: 'bg-gray-500'
              };
              setInventory(prev => [...prev, newProduct]);
            }
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

interface ProductModalProps {
  product: MilkVariety | null;
  onSave: (data: Partial<MilkVariety>) => void;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    pricePerLiter: product?.pricePerLiter || 0,
    stock: product?.stock || 0,
    description: product?.description || ''
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
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Liter (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.pricePerLiter}
              onChange={(e) => setFormData({ ...formData, pricePerLiter: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock (Liters)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryManagement;