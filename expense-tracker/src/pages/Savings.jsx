import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, PlusCircle, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import ExpenseTable from '../components/ExpenseTable';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const response = await api.get('/expenses');
      const savingsData = response.data.filter(item => item.type === 'savings');
      
      // Sort by date descending
      savingsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setSavings(savingsData);
    } catch (err) {
      setError('Failed to fetch savings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-indigo-600" />
            Savings Goal
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track money set aside for the future</p>
        </div>
        
        <button
          onClick={() => navigate('/add-expense?type=savings')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add to Savings
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-gray-500 font-medium">Total Savings Balance</h2>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              ₹{totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          This balance is kept separate from your everyday expenses and income.
        </div>
      </div>

      {/* Savings Transactions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Savings Transactions</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {savings.length > 0 ? (
            <ExpenseTable expenses={savings} onDelete={fetchSavings} />
          ) : (
            <div className="p-8 text-center bg-gray-50">
              <PiggyBank className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No savings entries yet</p>
              <p className="text-gray-400 text-sm mt-1">Start by adding some money to your savings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Savings;
