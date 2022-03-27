const { default: mongoose } = require('mongoose')
const { getMoviesForDate } = require('./aggregations/movies-showing-by-date')

const cinemaId = '623b47d48f8dbba189a1a6cb'
const date = new Date(2022, 2, 27)

async function execute() {
  await require('./index')
  const showtimes = await getMoviesForDate(date)

  console.log(showtimes[0])

  mongoose.connection.close()
}

execute()
