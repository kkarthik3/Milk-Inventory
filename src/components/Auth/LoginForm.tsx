import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Milk, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    
    if (!success) {
      setError('email', { message: 'Invalid credentials' });
    }
    setIsLoading(false);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@milk.com', password: 'admin123' },
    { role: 'Worker', email: 'worker@milk.com', password: 'worker123' },
    { role: 'Customer', email: 'customer@milk.com', password: 'customer123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Milk className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MilkFlow</h1>
          <p className="text-gray-600">Sign in to your delivery dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-blue-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h3>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <div key={account.role} className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">{account.role}:</span> {account.email} / {account.password}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;