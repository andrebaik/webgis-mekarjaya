const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  next();
};

module.exports = authenticateToken;
