module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (req.accepts('html')) {
    res.render('error', { message: err.message || 'Server error' });
  } else {
    res.json({ error: err.message || 'Server error' });
  }
};