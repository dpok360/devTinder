const adminAuth = (req, res, next) => {
  const token = 'xyz';
  const isAdminAuhorized = token === 'xyz';
  if (!isAdminAuhorized) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

module.exports = { adminAuth };
