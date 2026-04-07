import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBudgets, getCategorySpending, upsertBudget as apiUpsert, deleteBudget as apiDelete } from '../services/api';
import { isAuthenticated } from '../utils/auth';

const BudgetContext = createContext(null);

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
};

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);   // [{ id, category, limitAmount }]
  const [spending, setSpending] = useState({}); // { category: totalSpent }
  const [toasts, setToasts] = useState([]);     // [{ id, type, message }]

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const [b, s] = await Promise.all([getBudgets(), getCategorySpending()]);
      setBudgets(b);
      setSpending(s);

      // Check all budgets for notifications
      b.forEach(budget => {
        const spent = s[budget.category] || 0;
        const limit = budget.limitAmount;
        if (limit > 0) {
          const pct = (spent / limit) * 100;
          if (pct >= 100) {
            // Use setTimeout to ensure we don't dispatch during render phase
            setTimeout(() => {
              setToasts(prev => [
                ...prev, 
                { id: Math.random().toString(36).slice(2), type: 'danger', message: `🚨 ${budget.category} expense limit reached! (₹${spent.toFixed(0)} / ₹${limit.toFixed(0)}). Please control further spending.` }
              ]);
            }, 500);
          } else if (pct >= 80) {
            setTimeout(() => {
              setToasts(prev => [
                ...prev, 
                { id: Math.random().toString(36).slice(2), type: 'warning', message: `⚠️ You have used ${Math.round(pct)}% of your ${budget.category} budget. (₹${spent.toFixed(0)} / ₹${limit.toFixed(0)})` }
              ]);
            }, 500);
          }
        }
      });
      
    } catch (e) {
      console.error('BudgetContext: failed to load budget data', e);
    }
  }, []);

  const clearState = useCallback(() => {
    setBudgets([]);
    setSpending({});
    setToasts([]);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── toast helpers ──────────────────────────────────────────────────────────

  const addToast = (type, message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    // auto-dismiss after 6 s
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ── budget check & notification ───────────────────────────────────────────

  /**
   * Call after successfully adding an expense.
   * Checks if the category budget threshold (80% / 100%) has been crossed and
   * fires the appropriate toast.
   */
  const checkAndNotify = useCallback(async (category, addedAmount) => {
    // re-fetch latest spending after the new expense was saved
    let latestSpending = spending;
    try {
      latestSpending = await getCategorySpending();
      setSpending(latestSpending);
    } catch (_) { /* use stale data if fetch fails */ }

    const budget = budgets.find(b => b.category === category);
    if (!budget) return;

    const spent = latestSpending[category] || 0;
    const limit = budget.limitAmount;
    const pct = (spent / limit) * 100;

    if (pct >= 100) {
      addToast('danger', `🚨 ${category} expense limit reached! (₹${spent.toFixed(0)} / ₹${limit.toFixed(0)}). Please control further spending.`);
    } else if (pct >= 80) {
      addToast('warning', `⚠️ You have used ${Math.round(pct)}% of your ${category} budget. (₹${spent.toFixed(0)} / ₹${limit.toFixed(0)})`);
    }
  }, [budgets, spending]);

  // ── CRUD wrappers (keep local state in sync) ──────────────────────────────

  const upsertBudget = async (category, limitAmount) => {
    const result = await apiUpsert(category, limitAmount);
    setBudgets(prev => {
      const idx = prev.findIndex(b => b.category === category);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = result;
        return next;
      }
      return [...prev, result];
    });
    return result;
  };

  const removeBudget = async (category) => {
    await apiDelete(category);
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  return (
    <BudgetContext.Provider value={{ budgets, spending, toasts, removeToast, checkAndNotify, upsertBudget, removeBudget, refresh, clearState }}>
      {children}
    </BudgetContext.Provider>
  );
};
