const { default: axios } = require('axios')

const baseUrl = 'https://api.themoviedb.org/3'

const getMoviesConfig = (query) => {
  const page = 1

  return {
    baseURL: baseUrl,
    url: '/search/movie',
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'fr-FR',
      query,
      page,
      include_adult: false,
    },
  }
}

const getCreditsConfig = (id) => {
  return {
    baseURL: baseUrl,
    url: '/movie/' + id + '/credits',
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
    ...movie,
    cast,
    crew: getCrewDictionary(crew),
  }
}

const getMovies = async (searchTerm) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm))

  const movies = tmdbInfo.slice(0, 5)

  return await Promise.all(movies.map(getMovieCredits))
}

module.exports = {
  getMovies,
}
