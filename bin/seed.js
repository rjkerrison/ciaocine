require('dotenv/config')

const Cinema = require('../models/Cinema.model')
const { getShowtimes } = require('../api/allocine')
const { default: mongoose } = require('mongoose')
const { populateShowtimes } = require('../db/populate-showtimes')

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const seedShowtimes = async () => {
  await require('../db/index')
  const cinemas = await Cinema.find()

  for (let cinema of cinemas) {
    // Attempt to do a little rate limiting
    await sleep(250)
    const result = await findShowtimesAndSave(cinema)
    if (result) {
      console.log(`Finished importing showtimes for ${cinema.name}.`)
    }
  }

  return await mongoose.connection.close()
}

const findShowtimesAndSave = async (cinema) => {
  try {
    const showtimes = await getShowtimes(cinema.allocine_id)
    const population = await populateShowtimes(showtimes, cinema)
    //console.log('population', population)

    return population
  } catch (error) {
    console.error(`Error for cinema ${cinema.name}.`, error)
    return
  }
}

seedShowtimes()
