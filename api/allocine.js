const { default: axios } = require('axios')
const Cinema = require('../models/Cinema.model')
const baseUrl = process.env.BASE_URL
const partnerKey = process.env.PARTNER_KEY

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

const fromAllocineApiToShowtime = ({ onShow, version, scr }) => {
  return {
    ...onShow,
    version,
    scr,
  }
}

const getShowtimes = async (allocineCinemaId) => {
  const cinema = await Cinema.findOne({ allocine_id: allocineCinemaId })
  if (!cinema) {
    throw new Error(`cinema not found: ${place.theater.code}`)
  }

  const config = getShowtimeListConfig(cinema.allocine_id)
  const { data } = await axios(config)
  const { movieShowtimes, place } = data.feed.theaterShowtimes[0]

  if (!movieShowtimes) {
    return []
  }

  const showtimes = movieShowtimes.map(fromAllocineApiToShowtime)
  return showtimes
}

module.exports = {
  getShowtimes,
}
