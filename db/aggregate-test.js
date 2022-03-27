const { default: mongoose } = require('mongoose')
const getShowtimesForCinemaGroupByMovie = require('./aggregations/showtimes-by-movie')

let cinemaId = '623b47d48f8dbba189a1a6cb'

async function execute() {
  await require('./index')
  const showtimes = await getShowtimesForCinemaGroupByMovie(cinemaId)

  console.log(showtimes[0])

  mongoose.connection.close()
}

execute()
