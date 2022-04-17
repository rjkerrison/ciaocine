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
const getMovies = async (searchTerm, year) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm, year))

  const movies = tmdbInfo.slice(0, 5)

  return await Promise.all(movies.map(enhanceMovie))
}

module.exports = {
  getMovies,
}
