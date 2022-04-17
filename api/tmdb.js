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

const getMovies = async (searchTerm) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm))
  const { data } = await axios(getCreditsConfig(tmdbInfo[0].id))

  return [{ ...tmdbInfo[0], ...data }]
}

module.exports = {
  getMovies,
}
