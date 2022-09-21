require('dotenv/config')
const { default: mongoose } = require('mongoose')
const { deleteAllCalendars } = require('./calendar/delete')
const { addLocationsToCinemas } = require('./cinemas/locations')
const { addSlugsToCinemas } = require('./cinemas/slugs')
const { deleteAllMovies } = require('./movies/delete')
const { enhanceMovies } = require('./movies/enhance')
const { enhanceMoviesFromTmdb } = require('./movies/enhanceFromTmdb')
const { addSlugsToMovies } = require('./movies/slugs')
const { createShowtimes } = require('./showtimes/create')
const { deleteAllShowtimes } = require('./showtimes/delete')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => {
    readline.question(query, resolve)
  })
}

async function ask() {
  return await question(
    `Please specify one of: ${Object.keys(this)
      .filter((x) => x !== 'ask')
      .join(', ')}:\n\- `
  )
}

const showtimes = {
  remove: deleteAllShowtimes,
  create: createShowtimes,
  ask,
}

const movies = {
  remove: deleteAllMovies,
  slugs: addSlugsToMovies,
  enhance: enhanceMovies,
  tmdb: enhanceMoviesFromTmdb,
  ask,
}

const cinemas = {
  slugs: addSlugsToCinemas,
  locations: addLocationsToCinemas,
  ask,
}

const calendars = {
  remove: deleteAllCalendars,
  ask,
}

const subsections = {
  cinemas,
  calendars,
  movies,
  showtimes,
  ask,
}

const chooseAction = async (args) => {
  let requestedSubsection = args[0]

  while (!subsections[requestedSubsection]) {
    requestedSubsection = await subsections.ask()
  }
  const actions = subsections[requestedSubsection]

  let requestedAction = args[1]
  while (!actions[requestedAction]) {
    requestedAction = await actions.ask()
  }
  const action = actions[requestedAction]

  await action()
  return
}

const seed = async () => {
  await require('../db/index')
  const args = process.argv.slice(2)

  await chooseAction(args)

  await mongoose.connection.close()
  return
}

seed()
