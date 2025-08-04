import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, isBefore, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Booking, MilkVariety } from '../../types';

const CalendarBooking: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const milkVarieties: MilkVariety[] = [
    { _id: '1', name: 'Aavin Green', color: 'bg-green-500', pricePerLiter: 28, stock: 100, description: 'Full cream milk' },
    { _id: '2', name: 'Aavin Blue', color: 'bg-blue-500', pricePerLiter: 26, stock: 100, description: 'Toned milk' },
    { _id: '3', name: 'Aavin Orange', color: 'bg-orange-500', pricePerLiter: 24, stock: 100, description: 'Standardized milk' },
    { _id: '4', name: 'Aavin Purple', color: 'bg-purple-500', pricePerLiter: 22, stock: 100, description: 'Slim milk' },
    { _id: '5', name: 'Aavin Pink', color: 'bg-pink-500', pricePerLiter: 20, stock: 100, description: 'Double toned milk' },
    { _id: '6', name: 'Buttermilk', color: 'bg-yellow-500', pricePerLiter: 15, stock: 100, description: 'Fresh buttermilk' }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingForDate = (date: Date) => {
    return bookings.find(booking => isSameDay(new Date(booking.date), date));
  };

  const getMilkVariety = (milkType: string) => {
    return milkVarieties.find(variety => variety.name === milkType);
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;
    setSelectedDate(date);
    setEditingBooking(getBookingForDate(date) || null);
    setShowBookingModal(true);
  };

  const handleBooking = (formData: any) => {
    if (!selectedDate) return;

    const newBooking: Booking = {
      _id: Math.random().toString(),
      customerId: '1',
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      date: selectedDate,
      milkType: formData.milkType,
      quantity: formData.quantity,
      isExtra: formData.isExtra || false,
      status: 'pending',
      routeId: 'route1',
      createdAt: new Date()
    };

    if (editingBooking) {
      setBookings(prev => prev.map(b => b._id === editingBooking._id ? { ...newBooking, _id: editingBooking._id } : b));
    } else {
      setBookings(prev => [...prev, newBooking]);
    }

    setShowBookingModal(false);
    setSelectedDate(null);
    setEditingBooking(null);
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b._id !== bookingId));
    setShowBookingModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Milk Booking Calendar</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(prev => addDays(startOfMonth(prev), -1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={() => setCurrentDate(prev => addDays(endOfMonth(prev), 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((date) => {
          const booking = getBookingForDate(date);
          const milkVariety = booking ? getMilkVariety(booking.milkType) : null;
          const isPast = isBefore(date, new Date()) && !isToday(date);
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md
                ${isPast ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'bg-white hover:bg-blue-50'}
                ${isToday(date) ? 'ring-2 ring-blue-500' : 'border-gray-200'}
              `}
            >
              <div className="text-sm font-medium text-gray-900 mb-1">
                {format(date, 'd')}
              </div>
              
              {booking && (
                <div className="space-y-1">
                  <div className={`w-full h-2 rounded-full ${milkVariety?.color || 'bg-gray-300'}`}></div>
                  <div className="text-xs text-gray-600">
                    {booking.quantity}L {booking.milkType.split(' ')[1]}
                    {booking.isExtra && <span className="text-orange-500 font-medium"> +Extra</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDate && (
        <BookingModal
          date={selectedDate}
          milkVarieties={milkVarieties}
          existingBooking={editingBooking}
          onSave={handleBooking}
          onDelete={editingBooking ? () => deleteBooking(editingBooking._id) : undefined}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDate(null);
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
};

interface BookingModalProps {
  date: Date;
  milkVarieties: MilkVariety[];
  existingBooking: Booking | null;
  onSave: (data: any) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ date, milkVarieties, existingBooking, onSave, onDelete, onClose }) => {
  const [selectedMilk, setSelectedMilk] = useState(existingBooking?.milkType || milkVarieties[0].name);
  const [quantity, setQuantity] = useState(existingBooking?.quantity || 1);
  const [isExtra, setIsExtra] = useState(existingBooking?.isExtra || false);

  const selectedVariety = milkVarieties.find(v => v.name === selectedMilk);
  const totalPrice = (selectedVariety?.pricePerLiter || 0) * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ milkType: selectedMilk, quantity, isExtra });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {existingBooking ? 'Edit' : 'Book'} Milk for {format(date, 'MMM dd, yyyy')}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Milk Variety
            </label>
            <div className="grid grid-cols-2 gap-2">
              {milkVarieties.map((variety) => (
                <button
                  key={variety._id}
                  type="button"
                  onClick={() => setSelectedMilk(variety.name)}
                  className={`
                    p-3 rounded-xl border text-left transition-all
                    ${selectedMilk === variety.name 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${variety.color}`}></div>
                    <span className="text-sm font-medium">{variety.name.split(' ')[1]}</span>
                  </div>
                  <p className="text-xs text-gray-500">₹{variety.pricePerLiter}/L</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Liters)
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isExtra}
                onChange={(e) => setIsExtra(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Extra milk for today</span>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Price:</span>
              <span className="text-lg font-bold text-blue-600">₹{totalPrice}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center space-x-2"
            >
              {existingBooking ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{existingBooking ? 'Update' : 'Book'} Milk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarBooking;