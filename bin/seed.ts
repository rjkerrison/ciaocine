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
const { createShowtimesForAllMk2Cinemas } = require('./showtimes/mk2')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(query, resolve)
  })
}

async function ask(this: Object): Promise<string> {
  return await question(
    `Please specify one of: ${Object.keys(this)
      .filter((x) => x !== 'ask')
      .join(', ')}:\n\- `
  )
}

const showtimes = {
  remove: deleteAllShowtimes,
  create: createShowtimes,
  mk2: createShowtimesForAllMk2Cinemas,
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

interface Subsection {
  [a: string]: Function
  ask: Function
}

interface SubsectionDictionary {
  [a: string]: Subsection
}

const subsections: SubsectionDictionary = {
  cinemas,
  calendars,
  movies,
  showtimes,
}
const subsectionManager = {
  subsections,
  ask: ask.bind(subsections),
  get(key: string) {
    return this.subsections[key]
  },
}

const chooseAction = async (args: string[]) => {
  let requestedSubsection = args[0]

  while (!subsectionManager.subsections.hasOwnProperty(requestedSubsection)) {
    requestedSubsection = await subsectionManager.ask()
  }
  const actions: Subsection = subsectionManager.get(requestedSubsection)

  let requestedAction = args[1]
  while (!actions[requestedAction]) {
    requestedAction = await actions.ask()
  }
  const action = actions[requestedAction]

  await action()
  return
}

const seed = async () => {
  const connection = await require('../db/index')
  const args = process.argv.slice(2)

  await chooseAction(args)

  await connection.close()
  return
}

seed()
