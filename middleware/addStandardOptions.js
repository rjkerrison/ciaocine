// Middleware to make 'user' available in all templates
module.exports = (req, res, next) => {
  res.locals.user = {
    isLoggedIn: Boolean(req.session.user),
    profilePictureUrl: 'https://www.fillmurray.com/200/200',
    ...req.session.user,
  }

  next()
}
