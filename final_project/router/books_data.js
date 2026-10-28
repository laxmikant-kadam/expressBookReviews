const express = require('express');
const books = require('./booksdb.js');

const data_router = express.Router();

// Raw book data service consumed by the Axios calls in general.js

// All books
data_router.get('/books', (req, res) => {
  return res.status(200).json(books);
});

// A single book by ISBN
data_router.get('/books/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found.'
    });
  }

  return res.status(200).json(book);
});

// Books by author
data_router.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const matchingBooks = Object.values(books).filter(book =>
    book.author &&
    book.author.toLowerCase().includes(author)
  );

  return res.status(200).json(matchingBooks);
});

// Books by title
data_router.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const matchingBooks = Object.values(books).filter(book =>
    book.title &&
    book.title.toLowerCase().includes(title)
  );

  return res.status(200).json(matchingBooks);
});

module.exports.data = data_router;
