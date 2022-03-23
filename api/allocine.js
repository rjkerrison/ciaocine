const fetch = require('node-fetch')
const baseUrl = process.env.BASE_URL
const partnerKey = process.env.PARTNER_KEY
const Movie = require('../models/Movie.model')

const getShowtimeListUrl = (allocineCinemaId) => {
  const page = 1
  const count = 10

  const url =
    `${baseUrl}/showtimelist?partner=${partnerKey}&format=json` +
    `&theaters=${allocineCinemaId}&page=${page}&count=${count}`

  return url
}

const getShowtimes = async (allocineCinemaId) => {
  const url = getShowtimeListUrl(allocineCinemaId)
  console.log('fetching url', url)
  const response = await fetch(url)
  const result = await response.json()

  const showtimes = result.feed.theaterShowtimes[0].movieShowtimes.map(
    ({ onShow, version, scr, ...rest }) => {
      return {
        ...onShow,
        version,
        scr,
        rest,
      }
    }
  )

  showtimes.forEach(({ movie }) => saveMovieFromAllocine(movie))

  //   console.log(
  //     'fetched screenings',
  //     showtimes.map((x) => x.scr[0].t)
  //   )

  return showtimes
}

const saveMovieFromAllocine = async ({
  code: allocineId,
  title,
  poster: { href: poster },
}) => {
  const movie = await Movie.findOneAndUpdate(
    { allocineId },
    { allocineId, title, poster },
    { upsert: true, new: true }
  )
  return movie
}

module.exports = {
  getShowtimes,
}
