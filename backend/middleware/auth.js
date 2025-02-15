const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    token = token.replace("Bearer ", ""); // Ensure Bearer prefix is removed
    console.log("Received Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
