// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const db = require('../config/db');



const registerOwner = async ( fname, lname, username, password, color_theme_id) => {
  const usernameFound = await db.query('SELECT * FROM owners WHERE username = $1', [username]);
  const isUsernameFound = usernameFound.rows[0];

  if (isUsernameFound) {
      return { success: false, message: 'Username already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await db.query(
    'INSERT INTO owners (fname, lname, username, password, color_theme_id) VALUES ($1, $2, $3, $4, $5) RETURNING  id, fname, lname, username',
    [fname, lname, username, hashedPassword, color_theme_id]
  );
  return { success: true, newOwner: result.rows[0], token: jwt.generateToken(result.rows[0].id) };

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
  return { success: true, token: jwt.generateToken(owner.id) }

};

const developerPasswordReset = async (username, newPassword) => {
  try {
    const userResult = await db.query('SELECT * FROM owners WHERE username = $1', [username]);
    const user = userResult.rows[0];
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE owners SET password = $1 WHERE username = $2', [hashedPassword, username]);
    
    return { success: true, message: 'Password updated successfully' };
  } catch (err) {
    console.error('Developer password reset error:', err);
    return { success: false, message: 'Error resetting password' };
  }
};

module.exports = {
  registerOwner,
  loginOwner,
  developerPasswordReset
};