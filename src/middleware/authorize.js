const jwt = require('jsonwebtoken');
require('dotenv').config();



module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
    
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.authUser = decoded; 

    next(); 
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
};
