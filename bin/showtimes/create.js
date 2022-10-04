const { default: Cinema } = require('../../models/Cinema.model')
const { getShowtimes } = require('../../api/allocine')
const { saveShowtimesToDatabase } = require('../../db/populate-showtimes')
const { sleep } = require('../helpers')

const createShowtimes = async () => {
  const cinemas = await Cinema.find()
  console.log(`${cinemas.length} cinemas found.`)

  for (let cinema of cinemas) {
    // Attempt to do a little rate limiting
    await sleep(100)
    console.log(`Finding showtimes for ${cinema.name}.`)

    const showtimes = await findShowtimesAndSave(cinema)
    if (showtimes) {
      console.log(`Populated ${showtimes.length} showtimes for ${cinema.name}`)
    }
  }
}

const findShowtimesAndSave = async (cinema) => {
  try {
    const showtimesForMovieForCinemaForDay = await getShowtimes(
      cinema.allocine_id
    )
    const showtimes = await saveShowtimesToDatabase(
      showtimesForMovieForCinemaForDay,
      cinema
    )
    return showtimes
  } catch (error) {
    console.error(`Error for cinema ${cinema.name}.`, error)
    throw error
  }
}

module.exports = {
  createShowtimes,
}
