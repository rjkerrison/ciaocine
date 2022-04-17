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

const getMovies = async (searchTerm, year) => {
  const {
    data: { results: tmdbInfo },
  } = await axios(getMoviesConfig(searchTerm, year))
  const { data } = await axios(getCreditsConfig(tmdbInfo[0].id))

  return [{ ...tmdbInfo[0], ...data }]
}

module.exports = {
  getMovies,
}
