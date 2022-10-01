const { default: axios } = require('axios')
const Cinema = require('../models/Cinema.model')
const Movie = require('../models/Movie.model')
const Showtime = require('../models/Showtime.model')

const baseUrl = 'https://prod.api.mk2.com/cinema-complex'

const getShowtimesForCinemaConfig = (slug, { year, month, day }) => {
  return {
    baseURL: baseUrl,
    url: slug,
    params: {
      'show-time_gt': `${year}-${month}-${day}`,
    },
  }
}

const createShowtimesForAllMk2Cinemas = async (cinema) => {
  const cinemas = await Cinema.find({ slug: { $regex: 'mk2' } })

  return Promise.all(cinemas.map((cinema) => getShowtimesForCinema(cinema)))
}

const toYmd = (date) => {
  const [year, month, day] = date.split('-')
  return { year, month, day }
}

const getShowtimesForCinema = async (cinema) => {
  const dates = [
    '2022-10-01',
    '2022-10-02',
    '2022-10-03',
    '2022-10-04',
    '2022-10-05',
  ].map(toYmd)

  return Promise.all(
    dates.map((date) => getShowtimesForCinemaAndDate(cinema, date))
  )
}

const getShowtimesForCinemaAndDate = async (cinema, date) => {
  const config = getShowtimesForCinemaConfig(cinema.slug, date)

  try {
    const {
      data: {
        sessionsByType: [{ sessionsByFilmAndCinema }],
      },
    } = await axios(config)

    console.log(sessionsByFilmAndCinema.length)

    return Promise.all(
      sessionsByFilmAndCinema.map(({ film, sessions }) =>
        createShowtimesForFilm(film, sessions, cinema)
      )
    )
  } catch (error) {
    console.log(error?.response?.data?.message, cinema.slug)
    return
  }
}

const createShowtimesForFilm = async (film, sessions, cinema) => {
  const { slug, title, id } = film

  const movie = await Movie.findOne({
    $or: [
      {
        slug,
      },
      { title: { $regex: title, $options: 'i' } },
    ],
  })

  console.log({ title, id, foundId: movie?._id }, sessions.length)

  return Promise.all(
    sessions.map((session) => upsertShowtimeFromSession(session, movie, cinema))
  )
}

const upsertShowtimeFromSession = async (session, movie, cinema) => {
  const { showTime, mk2ShowtimeId: id } = session

  await upsertShowtime(movie, cinema, showTime, id).then((showtime) =>
    console.log(showtime)
  )
}

const upsertShowtime = async (movie, cinema, startTime, mk2id) => {
  const showtime = await Showtime.findOneAndUpdate(
    { movie, cinema, startTime },
    { movie, cinema, startTime, externalIdentifiers: { mk2: { id: mk2id } } },
    { upsert: true, new: true }
  )
  return showtime
}

module.exports = {
  createShowtimesForAllMk2Cinemas,
}
