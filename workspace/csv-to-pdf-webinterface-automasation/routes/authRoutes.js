const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Load environment variables
dotenv.config();

// Middleware for checking if the user is authenticated
const authenticate = async (req, res, next) => {
  try {
    // Check if the user provides a token
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No token provided' });
    }

    let secretKey = process.env.SECRET_KEY;
    if (process.env.SECRET_KEY == undefined) {
      secretKey = env.SECRET_KEY;
    }
    const decoded = await promisify(jwt.verify)(
      req.headers.authorization.split(' ')[1],
      secretKey
    );

    // Check if the user exists in the database
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error during token authentication:', error);
    res.status(500).json({ error: 'Error during token authentication' });
  }
};

router.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.user);
  console.log("route get /")
  res.render('index', {
    session: req.session
  });
  console.log(req.user);
  console.log(req.user);
  console.log("route get /")
});

router.get('/auth/register', (req, res) => {
  console.log(req.session);
  console.log(req.user);
  console.log("route get /auth/register")
  res.render('register', {

    session: req.session
  });
  console.log(req.user);
  console.log("route get /auth/register")
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email, } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.log('post /register passwordlog ', password);
    console.log('post register passwordlog ', password.length);
    console.log('post registerusername log eingabe:', username);
    console.log('email log eingabe:', email);
    // Create a new user
    const newUser = new User({ username, email });
    newUser.password = await bcrypt.hash(password, 10);
    console.log('passwordlog ', password);
    console.log('passwordlog ', password.length);
    console.log('username log eingabe:', username);
    console.log('post register email log eingabe:', email);

    // Save the user to the database
    await newUser.save();
    console.log('new user saved:' + newUser.save());

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error during registration' });
  }
});

// GET / login
router.get('/auth/login', (req, res) => {
  console.log(req.session);
  console.log(req.user);
  console.log("route get /auth/login")
  res.render('login', {
    session: req.session
  });
  console.log(req.session);
  console.log(req.user);
  console.log("route get /auth/login")
});

// POST /login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.session);
    console.log(req.user);
    console.log("route post /auth/login")

    // Validate input
    if (!username || !password) {
      console.log(req.session);
      console.log(req.user);
      console.log("route post /auth/login / Validate input")
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log(req.session);
      console.log(req.user);
      console.log("route get /auth/login / // Find the user by username")
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch true user password:', isMatch);

    if (isMatch) {
      console.log(req.session);
      console.log(req.user);
      console.log("route get /auth/login if match")
      req.session.userId = user.id;
      console.log(req.session);
      console.log(req.user);
      console.log(req.session.userId);
      console.log("route get /auth/login if match")
      // Create a JSON Web Tokenn
      const token = jwt.sign({
        username: user.username
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.cookie('token', token, { httpOnly: true });

      res.redirect('/home');
    } else {
      res.status(400).json({ error: 'Password is incorrect' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// GET /logout
router.get('auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.clearCookie('token');
    res.redirect('/auth/login');
  });
});

module.exports = router;