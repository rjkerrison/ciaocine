const Showtime = require('../models/Showtime.model')

const getRandomShowtimePopulated = async () => {
  const count = await Showtime.estimatedDocumentCount()
  const skip = Math.floor(Math.random() * count)
  const showtime = await Showtime.findOne().skip(skip).populate('movie cinema')
  return showtime
}

module.exports = {
  getRandomShowtimePopulated,
}
