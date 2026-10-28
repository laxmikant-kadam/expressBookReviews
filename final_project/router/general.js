
const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

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

// Task 2: Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 3: Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found.'
    });
  }

  return res.status(200).json(book);
});

// Task 4: Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const matchingBooks = Object.values(books).filter(book =>
    book.author &&
    book.author.toLowerCase().includes(author)
  );

  return res.status(200).json(matchingBooks);
});

// Task 5: Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const matchingBooks = Object.values(books).filter(book =>
    book.title &&
    book.title.toLowerCase().includes(title)
  );

  return res.status(200).json(matchingBooks);
});

// Task 6: Get reviews for a specific book
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found.'
    });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
