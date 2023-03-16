import { default as mongoose } from 'mongoose'
const { getMoviesBetweenTimes } =
  require('./aggregations/movies-showing-by-date').default

const date = new Date(2022, 2, 27)
const endDate = new Date(2022, 2, 28)

async function execute() {
  await require('./index')
  const showtimes = await getMoviesBetweenTimes(date, endDate)

  console.log(showtimes[0])

  mongoose.connection.close()
}

execute()
