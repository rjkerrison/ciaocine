require('dotenv/config')
const { default: mongoose } = require('mongoose')
const { deleteAllCalendars } = require('./calendar/delete')
const { addSlugsToCinemas } = require('./cinemas/slugs')
const { deleteAllMovies } = require('./movies/delete')
const { enhanceMovies } = require('./movies/enhance')
const { addSlugsToMovies } = require('./movies/slugs')
const { createShowtimes } = require('./showtimes/create')
const { deleteAllShowtimes } = require('./showtimes/delete')

const seed = async () => {
  await require('../db/index')
  const args = process.argv.slice(2)

  switch (args[0]) {
    case 'showtimes':
      await seedShowtimes(args)
      break
    case 'movies':
      await seedMovies(args)
      break
    case 'cinemas':
      await seedCinemas(args)
      break
    case 'calendars':
      await seedCalendars(args)
      break
    default:
      console.error(
        `Please specify one of 'showtimes', 'movies', 'cinemas', or 'calendars'.`
      )
  }

  return mongoose.connection.close()
}

const seedShowtimes = async (args) => {
  switch (args[1]) {
    case 'remove':
      await deleteAllShowtimes()
      break
    case 'create':
    default:
      await createShowtimes()
      break
  }
}

const seedMovies = async (args) => {
  switch (args[1]) {
    case 'remove':
      await deleteAllMovies()
      break
    case 'slugs':
      await addSlugsToMovies()
      break
    case 'enhance':
      await enhanceMovies()
      break
    default:
      console.error(`Please specify one of 'remove', 'enhance', or 'slugs'.`)
  }
}

const seedCinemas = async (args) => {
  switch (args[1]) {
    case 'slugs':
      await addSlugsToCinemas()
      break
    default:
      console.error(`Please specify 'slugs'.`)
  }
}

const seedCalendars = async (args) => {
  switch (args[1]) {
    case 'remove':
      await deleteAllCalendars()
      break
    default:
      console.error(`Please specify 'remove'.`)
  }
}

seed()
