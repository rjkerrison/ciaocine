const { default: axios } = require('axios')
const Cinema = require('../models/Cinema.model')
const baseUrl = process.env.BASE_URL
const partnerKey = process.env.PARTNER_KEY
const Movie = require('../models/Movie.model')
const Showtime = require('../models/Showtime.model')

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
  const { movieShowtimes, place } = data.feed.theaterShowtimes[0]

  const showtimes = movieShowtimes.map(({ onShow, version, scr, ...rest }) => {
    return {
      ...onShow,
      version,
      scr,
      rest,
    }
  })

  const cinema = await Cinema.findOne({ allocineId: allocineCinemaId })
  if (!cinema) {
    throw new Error(`cinema not found: ${place.theater.code}`)
  }

  showtimes.forEach(async ({ movie: fetchedMovie, scr }) => {
    const movie = await saveMovieFromAllocine(fetchedMovie)
    scr.forEach((s) => saveShowtimesFromAllocine({ ...s, movie, cinema }))
  })

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

const saveShowtimesFromAllocine = async ({
  d: date,
  t: times,
  movie,
  cinema,
}) => {
  times.forEach(({ code, $ }) => {
    // this is far too hacky and needs to be changed
    const startTime = new Date(date + ' ' + $)

    return saveShowtimeFromAllocine({
      code,
      startTime,
      movie,
      cinema,
    })
  })
}

const saveShowtimeFromAllocine = async ({
  code: allocineId,
  startTime,
  movie,
  cinema,
}) => {
  const showtime = await Showtime.findOneAndUpdate(
    { allocineId },
    { allocineId, movie, cinema, startTime },
    { upsert: true, new: true }
  )
  return showtime
}

module.exports = {
  getShowtimes,
}
