const { default: axios } = require('axios')
const baseUrl = process.env.BASE_URL
const partnerKey = process.env.PARTNER_KEY
const Movie = require('../models/Movie.model')

const getShowtimeListConfig = (allocineCinemaId) => {
  const page = 1
  const count = 10

  return {
    baseURL: baseUrl,
    url: '/showtimelist',
    params: {
      partner: partnerKey,
      theaters: allocineCinemaId,
      page,
      count,
      format: 'json',
    },
  }
}

const getShowtimes = async (allocineCinemaId) => {
  const config = getShowtimeListConfig(allocineCinemaId)
  const { data } = await axios(config)

  const showtimes = data.feed.theaterShowtimes[0].movieShowtimes.map(
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

  // console.log(
  //   'fetched screenings',
  //   showtimes.map((x) => x.scr[0].t)
  // )

  return showtimes
}

const saveMovieFromAllocine = async ({ code: allocineId, title, poster }) => {
  const href = poster?.href
  const movie = await Movie.findOneAndUpdate(
    { allocineId },
    { allocineId, title, poster: href },
    { upsert: true, new: true }
  )
  return movie
}

module.exports = {
  getShowtimes,
}
