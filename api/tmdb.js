const { default: axios } = require('axios')

const baseUrl = 'https://api.themoviedb.org/3'

const getMoviesConfig = (query, year) => {
  const page = 1

  console.log(query, year)

  return {
    baseURL: baseUrl,
    url: '/search/movie',
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'fr-FR',
      query,
      page,
      include_adult: false,
      year,
    },
  }
}

const getMovieInfoConfig = (id) => {
  return {
    baseURL: baseUrl,
    url: `/movie/${id}`,
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'fr-FR',
    },
  }
}

const getCreditsConfig = (id) => {
  return {
    baseURL: baseUrl,
    url: `/movie/${id}/credits`,
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'fr-FR',
    },
  }
}

const getCrewDictionary = (crew) => {
  const result = crew.reduce((dictionary, { job, name, id }) => {
    if (!dictionary[job]) {
      dictionary[job] = [{ name, id }]
    } else {
      dictionary[job].push({ name, id })
    }
    return dictionary
  }, {})
  return result
}

const getMovieCredits = async (movie) => {
  const {
    data: { cast, crew },
  } = await axios(getCreditsConfig(movie.id))

  return {
    cast,
    crew: getCrewDictionary(crew),
  }
}

const getMovieInfo = async (movie) => {
  const { data } = await axios(getMovieInfoConfig(movie.id))

  return data
}

const enhanceMovie = async (movie) => {
  const result = await Promise.all([
    getMovieInfo(movie),
    getMovieCredits(movie),
  ])

  const [additionalFields, { cast, crew }] = result

  return {
    ...movie,
    ...additionalFields,
    cast,
    crew,
  }
}

const stringsMatch = (a, b) => {
  return a.localeCompare(b, 'en', { sensitivity: 'base' }) === 0
}

const scoreMatch = (movie, { searchTerm, year, director }) => {
  const {
    title,
    crew: { Director: movieDirector },
    release_date,
  } = movie

  let score = 0
  if (stringsMatch(title, searchTerm)) {
    score += 45
  }
  if (movieDirector?.some((x) => stringsMatch(x.name, director))) {
    score += 50
  }
  if (new Date(release_date).getFullYear() === Number(year)) {
    score += 25
  }
  return score
}

const compareScores = (a, b) => {
  return b.score - a.score
}

const getMovies = async (searchTerm, { year, director }) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm, year))

  const movies = tmdbInfo.slice(0, 5)

  const enhancedMovies = await Promise.all(movies.map(enhanceMovie))

  enhancedMovies.forEach(
    (m) => (m.score = scoreMatch(m, { searchTerm, year, director }))
  )

  enhancedMovies.sort(compareScores)
  return enhancedMovies
}

module.exports = {
  getMovies,
}
