import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, PlusCircle, Wallet, PiggyBank, Target } from 'lucide-react';
import { removeToken, isAuthenticated } from '../utils/auth';
import { useBudget } from '../context/BudgetContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { clearState } = useBudget();

  const handleLogout = () => {
    removeToken();
    if (clearState) {
      clearState();
    }
    navigate('/login');
  };

  if (!isAuthenticated()) return null;

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/savings', name: 'Savings', icon: PiggyBank },
    { path: '/budget', name: 'Budget', icon: Target },
    { path: '/add-expense', name: 'Add Entry', icon: PlusCircle },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
              <Wallet className="w-8 h-8" />
              <span>ExpenseTracker</span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-emerald-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
