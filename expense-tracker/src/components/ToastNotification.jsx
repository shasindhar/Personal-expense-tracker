import React from 'react';
import { X, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

/**
 * Floating toast stack rendered in the top-right corner.
 * Each toast auto-dismisses after 6 seconds (set in BudgetContext).
 */
const ToastNotification = () => {
  const { toasts, removeToast } = useBudget();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 sm:w-96"
    >
      {toasts.map((toast) => {
        const isWarning = toast.type === 'warning';
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl shadow-xl p-4 border animate-slide-in
              ${isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-400 text-red-900'}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isWarning
                ? <AlertTriangle className="w-5 h-5 text-amber-500" />
                : <AlertOctagon className="w-5 h-5 text-red-500" />
              }
            </div>
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors
                ${isWarning ? 'text-amber-600' : 'text-red-600'}`}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
