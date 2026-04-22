import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { 'x-auth-token': token }
      });
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/expenses', formData, {
      headers: { 'x-auth-token': token }
    });
    setExpenses([res.data, ...expenses]);
    setFormData({ title: '', amount: '', category: '' });
  };

  const filteredExpenses = filter ? expenses.filter(exp => exp.category === filter) : expenses;
  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Expense Dashboard</h2>
        <p>Track and manage your expenses efficiently</p>
      </div>

      <div className="expense-form">
        <h3 className="form-title">Add New Expense</h3>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="title"
              placeholder="Expense Title"
              value={formData.title}
              onChange={onChange}
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount ($)"
              value={formData.amount}
              onChange={onChange}
              min="0"
              step="0.01"
              required
            />
            <select name="category" value={formData.category} onChange={onChange} required>
              <option value="">Select Category</option>
              <option value="Food">🍕 Food</option>
              <option value="Travel">✈️ Travel</option>
              <option value="Bills">💡 Bills</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Other">📦 Other</option>
            </select>
            <button type="submit" className="add-btn">Add Expense</button>
          </div>
        </form>
      </div>

      <div className="filter-section">
        <label>Filter by Category:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Food">🍕 Food</option>
          <option value="Travel">✈️ Travel</option>
          <option value="Bills">💡 Bills</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Shopping">🛍️ Shopping</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      <div className="total-section">
        <h3>Total Expenses</h3>
        <div className="total-amount">${total.toFixed(2)}</div>
      </div>

      <div className="expenses-list">
        <div className="expenses-header">Recent Expenses</div>
        {filteredExpenses.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No expenses found. Add your first expense above!
          </div>
        ) : (
          filteredExpenses.map(exp => (
            <div key={exp._id} className="expense-item">
              <div className="expense-info">
                <div className="expense-title">{exp.title}</div>
                <div className="expense-meta">
                  {exp.category} • {new Date(exp.date).toLocaleDateString()}
                </div>
              </div>
              <div className="expense-amount">${exp.amount.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;