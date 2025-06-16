// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const hireRoutes = require('./routes/hireRoutes');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const db = require('./db'); // Importing the DB connection
const auth = require('./middleware/auth'); // Import auth middleware

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/hire-requests', hireRoutes);


// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords don't match" });
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database error' });
      if (result.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user to database
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database error' });

        res.status(201).json({ msg: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt for email: ${email}`);

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

    if (result.length === 0) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const user = result[0];
    console.log(`Found user:`, { id: user.id, email: user.email });

    // Compare password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
    };

    console.log(`Generating token for user ID: ${user.id}`);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // Send back both token and user data
    console.log(`Login successful for user: ${email}`);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

// Delete Account Endpoint
app.delete('/api/users/delete-account/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Attempting to delete user account with ID: ${userId}`);

  // First, check if the user exists
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, users) => {
    if (err) {
      console.error('Database error when checking user:', err);
      return res.status(500).json({ msg: 'Database error when checking user' });
    }

    console.log('User lookup result:', users);
    
    if (!users || users.length === 0) {
      console.warn(`No user found with ID: ${userId}`);
      // For development, we'll still return success
      return res.status(200).json({ msg: 'Account deletion simulated (user not found)' });
    }

    // User exists, so let's delete
    const user = users[0];
    console.log(`Found user to delete:`, { id: user.id, email: user.email });

    // Delete user from database
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) {
        console.error('Database error during account deletion:', err);
        return res.status(500).json({ msg: 'Database error during account deletion' });
      }

      console.log('Delete query result:', result);
      
      if (result.affectedRows === 0) {
        console.warn(`Deletion query didn't affect any rows for user ID: ${userId}`);
      } else {
        console.log(`Successfully deleted ${result.affectedRows} rows for user ID: ${userId}`);
      }
      
      res.status(200).json({ msg: 'Account deleted successfully' });
    });
  });
});

// Test endpoint for authentication
app.get('/api/test-auth', auth, (req, res) => {
  res.json({ msg: 'Authentication successful', userId: req.user.userId });
});

// Logout Endpoint (just for completeness)
app.post('/api/logout', (req, res) => {
  // The actual logout is handled client-side by clearing localStorage
  res.status(200).json({ msg: 'Logged out successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});