// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const authRoutes = require('./routes/auth.routes');
const publicData = require('./routes/publicData.routes');
const categoryRoutes = require('./routes/category.routes');
const itemRoutes = require('./routes/item.routes');
const imageRoutes = require('./routes/image.routes');

const app = express();

// Security middleware
app.use(helmet({crossOriginResourcePolicy: {  policy: "cross-origin"  }}));
app.use(cors());
app.use(hpp());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicData);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/images', imageRoutes);

// Global error handler
//app.use(globalErrorHandler);

module.exports = app;