// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (ownerId) => {
  return jwt.sign({ id: ownerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const registerOwner = async ( fname, lname, username, password) => {
  const usernameFound = await db.query('SELECT * FROM owners WHERE username = $1', [username]);
  const isUsernameFound = usernameFound.rows[0];

  if (isUsernameFound) {
      return { success: false, message: 'Username already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await db.query(
    'INSERT INTO owners (fname, lname, username, password) VALUES ($1, $2, $3, $4) RETURNING  fname, lname, username',
    [fname, lname, username, hashedPassword]
  );
  return { success: true, newOwner: result.rows[0] };

};

const loginOwner = async (username, password) => {
  const result = await db.query('SELECT * FROM owners WHERE username = $1', [username]);
  const owner = result.rows[0];

  if (!owner) {
    return { success: false, message: 'Invalid credentials' }

  }

  const isMatch = await bcrypt.compare(password, owner.password);
  
  if (!isMatch) {
    return { success: false, message: 'Invalid credentials' }

  }
  return { success: true, token: generateToken(owner.id) }

};

module.exports = {
  registerOwner,
  loginOwner,
  generateToken,
};