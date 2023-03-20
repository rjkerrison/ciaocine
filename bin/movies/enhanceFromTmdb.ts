import { HydratedDocument } from 'mongoose'
import Movie, { MovieSchema } from '../../models/Movie.model'
import { sleep } from '../helpers'
import { getMoviesFromTmdb } from '../../api/tmdb'
import { convertToSlug } from '../../utils/slug'

const TMDB_URLS = {
  base: 'https://www.themoviedb.org',
  poster: '/t/p/w300_and_h450_bestv2',
  backdrop: '/t/p/w1920_and_h800_multi_faces',
}

const enhanceMoviesFromTmdb = async () => {
  await Movie.init()
  const movies = await Movie.find({
    'externalIdentifiers.letterboxd.slug': { $exists: 0 },
  })
  console.log(
    'Found %s movies without a populated letterboxd slug.',
    movies.length
  )

  let count = 0
  for (let movie of movies) {
    // Attempt to do a little rate limiting
    await sleep(250)
    console.log(`${count++} of ${movies.length}:`)
    await enhanceMovieFromTmdbSearch(movie)
  }

  console.log(`Found TMDB info for ${movies.length} movies.`)
}

const enhanceMovieFromTmdbSearch = async (
  movie: HydratedDocument<MovieSchema>
) => {
  try {
    const year = movie.releaseDate?.getFullYear()
    const director = movie.castingShort?.directors

    const found = await getMoviesFromTmdb(movie.originalTitle || movie.title, {
      year,
      director,
    })
    if (!found || !found.length) {
      console.log(
        `No movie found named ${
          movie.originalTitle || movie.title
        } in year ${year} by director ${director}.`
      )
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

    const updatedMovie = await movie.save()
    console.log(`Updated ${updatedMovie.title} with slug "${slug}".`)

    return
  } catch (e) {
    const error = e as Error
    console.error(`Error updating movie ${movie}.`, error.message)
    return
  }
}

export { enhanceMoviesFromTmdb }
