require('dotenv/config')

const { default: mongoose } = require('mongoose')
const Showtime = require('../models/Showtime.model')

const deleteAllShowtimes = async () => {
  await require('../db/index')
  const showtimes = await Showtime.deleteMany()
  console.log('Finished.')
  console.log(showtimes)

  return await mongoose.connection.close()
}

deleteAllShowtimes()
