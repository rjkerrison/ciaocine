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
    `Found ${movies.length} movies without a populated letterboxd slug.`
  )

  let count = 0
  let successCount = 0
  for (let movie of movies) {
    // Attempt to do a little rate limiting
    await sleep(100)
    const { message, status } = await enhanceMovieFromTmdbSearch(movie)
    console.log(
      `${count++} of ${movies.length} ${status.toLocaleUpperCase()}: ${message}`
    )
    if (status === 'success') {
      successCount++
    }
  }

  console.log(`Found TMDB info for ${successCount} of ${movies.length} movies.`)
}

type EnhancementResult = {
  status: 'success' | 'failure'
  message: string
}

const enhanceMovieFromTmdbSearch = async (
  movie: HydratedDocument<MovieSchema>
): Promise<EnhancementResult> => {
  try {
    const year = movie.releaseDate?.getFullYear()
    const director = movie.castingShort?.directors

    const found = await getMoviesFromTmdb(
      movie.originalTitle || movie.title || '',
      {
        year,
        director,
      }
    )
    if (!found || !found.length) {
      return {
        status: 'failure',
        message: `No movie found named ${
          movie.originalTitle || movie.title
        } in year ${year} by director ${director}.`,
      }
    }
    const {
      title,
      original_title: originalTitle,
      release_date: releaseDate,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      id,
    } = found[0]

    const poster =
      posterPath && `${TMDB_URLS.base}${TMDB_URLS.poster}${posterPath}`
    const backdrop =
      backdropPath && `${TMDB_URLS.base}${TMDB_URLS.backdrop}${backdropPath}`

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
      releaseDate,
      images: {
        poster,
        backdrop,
      },
    })

    const updatedMovie = await movie.save()

    return {
      status: 'success',
      message: `Updated ${updatedMovie.title} with slug "${slug}".`,
    }
  } catch (e) {
    const error = e as Error
    return {
      status: 'failure',
      message: `Error updating movie ${movie}: ${error.message}`,
    }
  }
}

export { enhanceMoviesFromTmdb }
