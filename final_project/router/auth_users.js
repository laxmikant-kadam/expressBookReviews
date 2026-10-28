
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];

const JWT_SECRET = 'bookshop_secret_key';

// Check whether a username is already registered
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check whether credentials match a registered user
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username &&
            user.password === password
  );
};

// Verify JWT and return decoded user information
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Authentication required. Provide a Bearer token.'
    });
    return null;
  }

  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token.'
    });
    return null;
  }
};

// Task 8: Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password.'
    });
  }

  const accessToken = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    message: 'User successfully logged in.',
    token: accessToken
  });
});

// Task 9: Add or update a review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const decoded = verifyToken(req, res);
  if (!decoded) return;

  const isbn = req.params.isbn;
  const review = req.body.review;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found.'
    });
  }

  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({
      message: 'A non-empty review is required.'
    });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  // One review per user per book; a later request updates it
  book.reviews[decoded.username] = review.trim();

  return res.status(200).json({
    message: 'Review added or updated successfully.',
    reviews: book.reviews
  });
});

// Task 10: Delete the logged-in user's review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const decoded = verifyToken(req, res);
  if (!decoded) return;

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found.'
    });
  }

  if (
    !book.reviews ||
    !Object.prototype.hasOwnProperty.call(
      book.reviews,
      decoded.username
    )
  ) {
    return res.status(404).json({
      message: 'No review found for this user.'
    });
  }

  delete book.reviews[decoded.username];

  return res.status(200).json({
    message: 'Review deleted successfully.',
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
