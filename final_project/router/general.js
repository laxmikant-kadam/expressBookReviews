const express = require('express');
const axios = require('axios');
const { users } = require('./auth_users.js');

const public_users = express.Router();

// Internal data service consumed by the Axios requests below
const API_BASE = `http://localhost:${process.env.PORT || 5000}/data`;

// Task 7: Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({
      message: 'Username already exists.'
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: 'User successfully registered. Login to continue.'
  });
});

// Task 11: Get all books using async/await with Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books.',
      error: error.message
    });
  }
});

// Task 12: Get book details by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/books/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    return res.status(500).json({
      message: 'Unable to retrieve the book.',
      error: error.message
    });
  }
});

// Task 13: Get books by author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = encodeURIComponent(req.params.author);
    const response = await axios.get(`${API_BASE}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by author.',
      error: error.message
    });
  }
});

// Task 14: Get books by title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = encodeURIComponent(req.params.title);
    const response = await axios.get(`${API_BASE}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by title.',
      error: error.message
    });
  }
});

// Task 6: Get reviews for a specific book using async/await with Axios
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/books/${req.params.isbn}`);
    return res.status(200).json(response.data.reviews || {});
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    return res.status(500).json({
      message: 'Unable to retrieve the reviews.',
      error: error.message
    });
  }
});

module.exports.general = public_users;
