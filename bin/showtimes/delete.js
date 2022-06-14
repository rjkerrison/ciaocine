const Showtime = require('../../models/Showtime.model')

const deleteAllShowtimes = async () => {
  const showtimes = await Showtime.deleteMany()
  console.log('Finished.')
  console.log(showtimes)
}

module.exports = {
  deleteAllShowtimes,
}
