const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
const allowedOrigin = 'https://moodboard-lite-37mv.vercel.app';
app.use(cors({
  origin: allowedOrigin,
  credentials: true, // Necessary if using cookies or auth headers
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const moodboardRoutes = require('./routes/moodboard');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/moodboards', moodboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
