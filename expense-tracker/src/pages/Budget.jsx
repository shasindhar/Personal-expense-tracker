import React, { useState, useEffect } from 'react';
import { Target, Trash2, Plus, AlertTriangle, AlertOctagon, CheckCircle, Loader2, IndianRupee, Tag, Pencil, X } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Travel',
  'Education',
  'Other',
];

const getCategoryIcon = (category) => {
  const icons = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '⚡',
    'Health': '💊',
    'Travel': '✈️',
    'Education': '📚',
    'Other': '📦',
  };
  return icons[category] || '💰';
};

const ProgressBar = ({ pct }) => {
  const capped = Math.min(pct, 100);
  const color =
    pct >= 100 ? 'bg-red-500' :
    pct >= 80  ? 'bg-amber-400' :
                 'bg-emerald-500';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${capped}%` }}
      />
    </div>
  );
};

const StatusBadge = ({ pct }) => {
  if (pct >= 100) return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
      <AlertOctagon className="w-3 h-3" /> Limit Reached
    </span>
  );
  if (pct >= 80) return (
    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3" /> Near Limit
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
      <CheckCircle className="w-3 h-3" /> On Track
    </span>
  );
};

const Budget = () => {
  const { budgets, spending, upsertBudget, removeBudget } = useBudget();
  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // true when editing an existing budget

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  // When the selected category changes, auto-fill the limit if a budget already exists
  useEffect(() => {
    if (formCategory) {
      const existing = budgets.find(b => b.category === formCategory);
      if (existing) {
        setFormLimit(String(existing.limitAmount));
        setIsEditing(true);
      } else {
        setFormLimit('');
        setIsEditing(false);
      }
    } else {
      setFormLimit('');
      setIsEditing(false);
    }
    setFormError('');
  }, [formCategory, budgets]);

  // Pre-fill form for editing a specific budget card
  const handleEditCard = (budget) => {
    setFormCategory(budget.category);
    setFormLimit(String(budget.limitAmount));
    setIsEditing(true);
    setFormError('');
    // Scroll the form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormCategory('');
    setFormLimit('');
    setIsEditing(false);
    setFormError('');
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!formCategory || !formLimit || parseFloat(formLimit) <= 0) {
      setFormError('Please select a category and enter a valid limit.');
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      await upsertBudget(formCategory, parseFloat(formLimit));
      setFormCategory('');
      setFormLimit('');
      setIsEditing(false);
    } catch (err) {
      setFormError('Failed to save budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Remove budget for "${category}"?`)) {
      await removeBudget(category);
      // Also clear form if we were editing that category
      if (formCategory === category) {
        handleCancelEdit();
      }
    }
  };

  // Categories that have spending but no budget set
  const unbudgetedCategories = Object.keys(spending).filter(
    cat => !budgets.find(b => b.category === cat)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-7 h-7 text-emerald-600" />
            Budget Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">Set category spending caps for <span className="font-medium text-gray-700">{monthLabel}</span></p>
        </div>
        <div className="text-sm text-gray-400">
          {budgets.length} budget{budgets.length !== 1 ? 's' : ''} set
        </div>
      </div>

      {/* Set / Edit Budget Form */}
      <div className={`bg-white rounded-2xl shadow-sm border p-6 mb-8 transition-all ${isEditing ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            {isEditing
              ? <><Pencil className="w-4 h-4 text-emerald-600" /> Edit Budget Limit</>
              : <><Plus className="w-4 h-4 text-emerald-600" /> Set a Budget Limit</>
            }
          </h2>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-1.5">
            <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
            Editing budget for <strong>{formCategory}</strong>. Update the amount below and click Save.
          </div>
        )}

        <form onSubmit={handleSetBudget} className="flex flex-col sm:flex-row gap-3">
          {/* Category Select */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={formCategory}
              onChange={e => setFormCategory(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white appearance-none"
            >
              <option value="">Select category…</option>
              {EXPENSE_CATEGORIES.map(c => {
                const existing = budgets.find(b => b.category === c);
                return (
                  <option key={c} value={c}>
                    {c}{existing ? ` (₹${existing.limitAmount.toLocaleString()} set)` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Amount Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              step="1"
              placeholder={isEditing ? 'Update limit amount' : 'Limit amount'}
              value={formLimit}
              onChange={e => setFormLimit(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Set Limit'}
          </button>
        </form>
        {formError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {formError}
          </p>
        )}
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No budgets set yet.</p>
          <p className="text-sm">Use the form above to add your first spending cap.</p>
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Allocated Budget Limits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {budgets.map(b => {
              const spent = spending[b.category] || 0;
              const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
              const remaining = Math.max(b.limitAmount - spent, 0);
              const isCurrentlyEditing = formCategory === b.category && isEditing;
              return (
                <div
                  key={b.id || b.category}
                  className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md
                    ${isCurrentlyEditing ? 'border-emerald-400 ring-2 ring-emerald-100' :
                      pct >= 100 ? 'border-red-200' : pct >= 80 ? 'border-amber-200' : 'border-gray-100'}`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(b.category)}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{b.category}</p>
                        <p className="text-xs text-gray-400">Limit: ₹{b.limitAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Edit button */}
                      <button
                        onClick={() => handleEditCard(b)}
                        className={`transition-colors p-1 rounded hover:bg-emerald-50 ${isCurrentlyEditing ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-500'}`}
                        title="Edit budget limit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(b.category)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                        title="Remove budget"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <ProgressBar pct={pct} />

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Spent: <span className="font-semibold text-gray-700">₹{spent.toLocaleString()}</span></span>
                    <span>Left: <span className="font-semibold text-gray-700">₹{remaining.toLocaleString()}</span></span>
                  </div>

                  {/* Status badge + percentage */}
                  <div className="flex items-center justify-between">
                    <StatusBadge pct={pct} />
                    <span className={`text-xs font-bold ${pct >= 100 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {Math.round(pct)}%
                    </span>
                  </div>

                  {/* Edit shortcut link */}
                  {!isCurrentlyEditing && (
                    <button
                      onClick={() => handleEditCard(b)}
                      className="w-full text-center text-xs text-emerald-600 hover:text-emerald-800 hover:underline font-medium py-1 border-t border-gray-50 mt-1 transition-colors"
                    >
                      ✏️ Edit limit
                    </button>
                  )}
                  {isCurrentlyEditing && (
                    <div className="w-full text-center text-xs text-emerald-600 font-medium py-1 border-t border-emerald-100 mt-1">
                      ✏️ Editing in form above…
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Unbudgeted spending */}
      {unbudgetedCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Spending without a budget limit</h3>
          <div className="flex flex-wrap gap-3">
            {unbudgetedCategories.map(cat => (
              <div key={cat} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-lg">{getCategoryIcon(cat)}</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">{cat}</p>
                  <p className="text-xs text-gray-400">₹{(spending[cat] || 0).toLocaleString()} spent</p>
                </div>
                <button
                  onClick={() => setFormCategory(cat)}
                  className="ml-2 text-xs text-emerald-600 hover:underline font-medium"
                >
                  Set limit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
