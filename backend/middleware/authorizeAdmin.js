const authorizeAdmin = (req, res, next) => {
  console.log("Admin Auth Check - User Data:", req.user);
  
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = authorizeAdmin;