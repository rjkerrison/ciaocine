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

const getMovies = async (searchTerm) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm))
  return tmdbInfo
}

module.exports = {
  getMovies,
}
