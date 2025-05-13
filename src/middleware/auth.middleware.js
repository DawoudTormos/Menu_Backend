// middleware/auth.middleware.js
const jwt = require("../utils/jwt");
const db = require("../config/db");

const protect = async (req, res, next) => {
  try {
    let token;
    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) 
      {
      // Extract token from Bearer token
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in",
      });
    }

    let decoded;

    try {
      decoded = jwt.verifyToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please log in again",
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please log in again", //invalid signatur, content or format
        });
      }

      return res.status(500).json({
        success: false,
        error: "Internal server error during authentiction.",
        message: err.message,
      });
    }

    const result = await db.query("SELECT * FROM owners WHERE id = $1", [
      decoded.id,
    ]);

    const currentOwner = result.rows[0];

    if (!currentOwner) {
      return res.status(401).json({
        success: false,
        message: "The owner belonging to this token no longer exists",
      });
    }

    req.owner = currentOwner;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An authentication error occurred.",
    });
  }
};

module.exports = {
  protect,
};
