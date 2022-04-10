require('dotenv/config')

const Cinema = require('../models/Cinema.model')
const { getShowtimes } = require('../api/allocine')
const { default: mongoose } = require('mongoose')
const { populateShowtimes } = require('../db/populate-showtimes')
const { sleep } = require('./enhanceMovies')

const seedShowtimes = async () => {
  await require('../db/index')
  const cinemas = await Cinema.find()
  console.log(`${cinemas.length} cinemas found.`)

  for (let cinema of cinemas) {
    // Attempt to do a little rate limiting
    await sleep(250)
    const showtimes = await findShowtimesAndSave(cinema)
    if (showtimes) {
      console.log(`Populated ${showtimes.length} showtimes for ${cinema.name}`)
    }
  }

  return await mongoose.connection.close()
}

const findShowtimesAndSave = async (cinema) => {
  try {
    const showtimes = await getShowtimes(cinema.allocine_id)
    const population = await populateShowtimes(showtimes, cinema)
    return population
  } catch (error) {
    console.error(`Error for cinema ${cinema.name}.`, error)
    return
  }
}

seedShowtimes()
