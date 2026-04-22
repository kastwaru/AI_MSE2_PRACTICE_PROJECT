const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (req.url === '/api/auth/register' || req.url.endsWith('/register')) {
      // Register
      try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    } else if (req.url === '/api/auth/login' || req.url.endsWith('/login')) {
      // Login
      try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    }
  } else {
    res.status(405).json({ msg: 'Method not allowed' });
  }
}