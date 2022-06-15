require('dotenv/config')
const { default: mongoose } = require('mongoose')
const { deleteAllCalendars } = require('./calendar/delete')
const { addLocationsToCinemas } = require('./cinemas/locations')
const { addSlugsToCinemas } = require('./cinemas/slugs')
const { deleteAllMovies } = require('./movies/delete')
const { enhanceMovies } = require('./movies/enhance')
const { addSlugsToMovies } = require('./movies/slugs')
const { createShowtimes } = require('./showtimes/create')
const { deleteAllShowtimes } = require('./showtimes/delete')

const showtimes = {
  remove: deleteAllShowtimes,
  create: createShowtimes,
  fallback,
}

const movies = {
  remove: deleteAllMovies,
  slugs: addSlugsToMovies,
  enhance: enhanceMovies,
  fallback,
}

function fallback() {
  console.error(
    `Please specify one of: ${Object.keys(this)
      .filter((x) => x !== 'fallback')
      .join(', ')}.`
  )
}
const cinemas = {
  slugs: addSlugsToCinemas,
  locations: addLocationsToCinemas,
  fallback,
}

const calendars = {
  remove: deleteAllCalendars,
  fallback,
}

const actions = {
  cinemas,
  calendars,
  movies,
  showtimes,
  fallback,
}

const chooseAction = async (args) => {
  const requestedSubsection = args[0]
  const subsection = actions[requestedSubsection]

  if (!subsection) {
    await actions.fallback()
    return
  }

  const requestedAction = args[1]
  const action = subsection[requestedAction]
  if (!action) {
    await subsection.fallback()
    return
  }

  await action()
  return
}

const seed = async () => {
  await require('../db/index')
  const args = process.argv.slice(2)

  await chooseAction(args)

  return mongoose.connection.close()
}

seed()
