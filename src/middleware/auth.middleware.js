// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT * FROM owners WHERE id = $1', [decoded.id]);
    const currentOwner = result.rows[0];

    if (!currentOwner) {
      return res.status(401).json({
        status: 'fail',
        message: 'The owner belonging to this token no longer exists',
      });
    }

    req.owner = currentOwner;
    next();
  } catch (err) {
    next(err);
  }
};