import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, Loader2, AlertCircle, Plus, Wallet, PiggyBank, Target, AlertTriangle, AlertOctagon, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseTable from '../components/ExpenseTable';
import { useBudget } from '../context/BudgetContext';
import { getUser } from '../utils/auth';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const { budgets, spending } = useBudget();
  const user = getUser();

  const groupedExpenses = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(exp);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter((e) => (e.id || e._id) !== id));
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const totalExpenses = expenses
    .filter(exp => exp.type === 'expense')
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
  const totalIncome = expenses
    .filter(exp => exp.type === 'income')
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const totalSavings = expenses
    .filter(exp => exp.type === 'savings')
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses
    .filter((exp) => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && exp.type === 'expense';
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  // Budget calculations
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalBudgetSpent = Object.values(spending).reduce((sum, v) => sum + v, 0);
  const remainingBudget = totalBudgetLimit - totalBudgetSpent;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          {user && (
            <p className="text-emerald-600 font-medium mb-1">Welcome back, {user.name}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-500">Track and manage your income and spending</p>
        </div>
        <Link
          to="/add-expense"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Entry
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Income</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">Total Income</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <IndianRupee className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Expenses</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">Total Expenses</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Savings */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <PiggyBank className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Savings</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">Total Savings</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Balance</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">Net Balance</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{(totalIncome - totalExpenses - totalSavings).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Month Spend */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Monthly</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">Month Spend</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{currentMonthExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Remaining Budget */}
        <div className={`p-5 rounded-2xl shadow-sm border ${remainingBudget < 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${remainingBudget < 0 ? 'bg-red-100' : 'bg-purple-50'}`}>
              <Target className={`w-5 h-5 ${remainingBudget < 0 ? 'text-red-600' : 'text-purple-600'}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${remainingBudget < 0 ? 'text-red-700 bg-red-100' : 'text-purple-600 bg-purple-50'}`}>Budget</span>
          </div>
          <h3 className="text-xs font-medium text-gray-500">
            {remainingBudget < 0 ? 'Over Budget' : 'Remaining Budget'}
          </h3>
          <p className={`text-xl font-bold mt-1 ${remainingBudget < 0 ? 'text-red-700' : 'text-gray-900'}`}>
            {totalBudgetLimit === 0 ? '—' : `₹${Math.abs(remainingBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
          {totalBudgetLimit === 0 && (
            <Link to="/budget" className="text-xs text-purple-600 hover:underline">Set budgets →</Link>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-6">Spending by Category</h3>
          <ExpenseChart data={expenses} type="pie" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-6">Monthly Overview</h3>
          <ExpenseChart data={expenses} type="bar" />
        </div>
      </div>

      {/* Category Budget Progress */}
      {budgets.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Category Budget Progress
            </h3>
            <Link
              to="/budget"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Manage Budgets →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgets.map(b => {
              const spent = spending[b.category] || 0;
              const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
              const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500';
              const textColor = pct >= 100 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-emerald-600';
              return (
                <div key={b.category} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">{b.category}</span>
                    <div className="flex items-center gap-1.5">
                      {pct >= 100 && <AlertOctagon className="w-3.5 h-3.5 text-red-500" />}
                      {pct >= 80 && pct < 100 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      {pct < 80 && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      <span className={`text-xs font-semibold ${textColor}`}>{Math.round(pct)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>₹{spent.toLocaleString()} spent</span>
                    <span>₹{b.limitAmount.toLocaleString()} limit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Transactions</h3>
        
        {Object.keys(groupedExpenses).length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 italic">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => {
              const isOpen = openCategories[category];
              const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
              
              return (
                <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">{category}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        {categoryExpenses.length} entries
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700">₹{categoryTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="p-0 border-t border-gray-200">
                      <ExpenseTable expenses={categoryExpenses} onDelete={handleDelete} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
