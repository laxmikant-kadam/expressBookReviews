
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes =
  require('./router/auth_users.js').authenticated;

const genl_routes =
  require('./router/general.js').general;

const data_routes =
  require('./router/books_data.js').data;

const { JWT_SECRET } = require('./router/auth_users.js');

const app = express();

// Parse JSON and form request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Customer session middleware
app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true
  })
);

// Authenticate protected customer routes
app.use('/customer/auth/*', (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required.'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
});

// Customer routes
app.use('/customer', customer_routes);

// Public routes
app.use('/', genl_routes);

// Internal book data service used by the Axios requests in general.js
app.use('/data', data_routes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
