const Movie = require('../../models/Movie.model')
const { sleep } = require('../helpers')
const { getMoviesFromTmdb } = require('../../api/tmdb')
const { convertToSlug } = require('../../utils/slug')

const TMDB_URLS = {
  base: 'https://www.themoviedb.org',
  poster: '/t/p/w300_and_h450_bestv2',
  backdrop: '/t/p/w1920_and_h800_multi_faces',
}

const enhanceMoviesFromTmdb = async () => {
  await Movie.init()
  const movies = await Movie.find()
  console.log('Found %s movies.', movies.length)

  const filteredMovies = movies
  // .filter(
  //   (movie) => !movie.externalIdentifiers.tmdb.id
  // )

  for (let movie of filteredMovies) {
    // Attempt to do a little rate limiting
    await sleep(250)
    await enhanceMovieFromTmdbSearch(movie)
  }

  console.log(`Found TMDB info for ${filteredMovies.length} movies.`)
  console.log(`Skipped ${movies.length - filteredMovies.length} movies.`)
}

const enhanceMovieFromTmdbSearch = async (movie) => {
  try {
    const year = movie.releaseDate?.getFullYear()
    const director = movie.castingShort?.directors

    const found = await getMoviesFromTmdb(movie.originalTitle || movie.title, {
      year,
      director,
    })
    if (!found || !found.length) {
      return
    }
    const {
      title,
      original_title: originalTitle,
      poster_path,
      release_date,
      backdrop_path,
      id,
    } = found[0]

    const poster =
      poster_path && [TMDB_URLS.base, TMDB_URLS.poster, poster_path].join('')
    const backdrop =
      backdrop_path &&
      [TMDB_URLS.base, TMDB_URLS.backdrop, backdrop_path].join('')

    const slug = convertToSlug(title)

    movie.set({
      externalIdentifiers: {
        letterboxd: {
          // let's try it
          slug,
        },
        tmdb: {
          id,
          title,
          originalTitle,
        },
      },
      releaseDate: release_date,
      images: {
        poster,
        backdrop,
      },
    })

    const updatedMovie = await movie.save({ new: true })
    console.log(`Updated ${updatedMovie.title}.`)

    return
  } catch (error) {
    console.error(`Error updating movie ${movie}.`, error.message)
    return
  }
}

module.exports = {
  enhanceMoviesFromTmdb,
}
