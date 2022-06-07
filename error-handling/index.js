module.exports = (app) => {
  app.use((req, res, next) => {
    // 404 for API
    return res
      .status(404)
      .json({ errorMessage: `Cannot ${req.method} ${req.originalUrl}` })
  })

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error('ERROR: ', req.method, req.path, err)

    // only render if the error occurred before sending the response
    if (!res.headersSent) {
      res.status(500).send({ error: err.message })
    } else {
      console.error('ERROR OCCURRED AFTER SENDING HEADER')
    }
  })
}
