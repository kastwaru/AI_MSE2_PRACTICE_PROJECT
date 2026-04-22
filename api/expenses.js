const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Expense model
const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const authMiddleware = (handler) => async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    return handler(req, res);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const handler = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    // Add expense
    const { title, amount, category } = req.body;
    try {
      const expense = new Expense({
        user: req.user.id,
        title,
        amount,
        category
      });
      await expense.save();
      res.json(expense);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  } else if (req.method === 'GET') {
    // Get expenses
    try {
      const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  } else {
    res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authMiddleware(handler);