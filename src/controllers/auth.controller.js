// controllers/auth.controller.js
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { fname, lname, username, password } = req.body;
    const serviceResult = await authService.registerOwner( fname, lname, username, password);

    if(!serviceResult.success) {
      return res.status(200).json({
        message: serviceResult.message,
      });
    }

    const owner = serviceResult.newOwner;

    return res.status(201).json({
      status: 'success',
      token: serviceResult.token,
      data: owner,
      
    });

  } catch (err) {
    res.status(500).json({
      status: 'internal server error',
      message: err.message,

    });
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const serviceResult = await authService.loginOwner(username, password);

    if(!serviceResult.success) {
      return res.status(200).json({
        message: serviceResult.message,
      });
    }else{
      return res.status(200).json({
        status: 'success',
        token: serviceResult.token,
      });
    }



  } catch (err) {
    res.status(500).json({
      status: 'internal server error',
      message: err.message,

    });
  }
};

module.exports = {
  register,
  login,
};