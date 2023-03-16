import Cinema, { CinemaSchema } from '../../models/Cinema.model'
import { getShowtimes } from '../../api/allocine'
import { saveShowtimesToDatabase } from '../../db/populate-showtimes'

type ConcurrencyStrategy = 'concurrent' | 'sequential'

const mapForConcurrencyStrategy = async <T, OutputType = void>(
  items: T[],
  mapOperation: (item: T) => Promise<OutputType>,
  strategy: ConcurrencyStrategy
): Promise<OutputType[]> => {
  switch (strategy) {
    case 'sequential':
      return mapSequentially(items, mapOperation)
    case 'concurrent':
      return Promise.all(items.map(mapOperation))
  }
}

const mapSequentially = async <T, OutputType = void>(
  items: T[],
  mapOperation: (item: T) => Promise<OutputType>
): Promise<OutputType[]> => {
  const results: OutputType[] = []

  for (const item of items) {
    const result = await mapOperation(item)
    results.push(result)
  }
  return results
}

const createShowtimes = async (): Promise<void> => {
  const cinemas = await Cinema.find()
  console.log(`${cinemas.length} cinemas found.`)

  await mapForConcurrencyStrategy(
    cinemas,
    createShowtimesForCinema,
    'sequential'
  )
}

const createShowtimesForCinema = async (cinema: CinemaSchema) => {
  console.log(`Finding showtimes for ${cinema.name}.`)

  const showtimes = await findShowtimesAndSave(cinema)
  if (showtimes) {
    console.log(`Populated ${showtimes.length} showtimes for ${cinema.name}`)
  }
}

const findShowtimesAndSave = async (cinema: CinemaSchema) => {
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

export { createShowtimes }
