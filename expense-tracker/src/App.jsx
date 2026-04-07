import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Budget from './pages/Budget';
import AddExpense from './pages/AddExpense';
import { isAuthenticated } from './utils/auth';
import { BudgetProvider } from './context/BudgetContext';
import ToastNotification from './components/ToastNotification';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <BudgetProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <ToastNotification />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/savings"
                element={
                  <ProtectedRoute>
                    <Savings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <Budget />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/add-expense"
                element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </BudgetProvider>
    </Router>
  );
};

export default App;

