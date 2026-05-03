import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'];

const ExpenseChart = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 italic">
        No data available for chart
      </div>
    );
  }

  if (type === 'pie') {
    // Group expenses by category for pie chart, excluding income and savings
    const categoryData = data
      .filter(item => item.type === 'expense')
      .reduce((acc, curr) => {
        const existing = acc.find((item) => item.name === curr.category);
        if (existing) {
          existing.value += parseFloat(curr.amount);
        } else {
          acc.push({ name: curr.category, value: parseFloat(curr.amount) });
        }
        return acc;
      }, []);

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="40%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ paddingLeft: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'bar') {
    // Group data by month for bar chart (Income vs Expenses vs Savings)
    const monthlyData = data.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const existing = acc.find((item) => item.name === month);
      
      const isIncome = curr.type === 'income';
      const isSavings = curr.type === 'savings';
      const isExpense = curr.type === 'expense';
      
      if (existing) {
        if (isIncome) existing.Income += parseFloat(curr.amount);
        else if (isSavings) existing.Savings += parseFloat(curr.amount);
        else if (isExpense) existing.Expenses += parseFloat(curr.amount);
      } else {
        acc.push({ 
          name: month, 
          Income: isIncome ? parseFloat(curr.amount) : 0,
          Expenses: isExpense ? parseFloat(curr.amount) : 0,
          Savings: isSavings ? parseFloat(curr.amount) : 0
        });
      }
      return acc;
    }, []);

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart data={monthlyData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" align="center" iconType="rect" wrapperStyle={{ paddingBottom: '20px' }} />
            <Bar dataKey="Income" fill="#4fc3f7" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey="Expenses" fill="#ff5252" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey="Savings" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default ExpenseChart;
