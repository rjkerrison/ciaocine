const fetch = require('node-fetch')
const baseUrl = process.env.BASE_URL
const partnerKey = process.env.PARTNER_KEY

const getShowtimeListUrl = (allocineCinemaId) => {
  const page = 1
  const count = 10

  return (
    `${baseUrl}/showtimelist?partner=${partnerKey}&format=json` +
    `&theaters=${allocineCinemaId}&page=${page}&count=${count}`
  )
}

const getShowtimes = async (allocineCinemaId) => {
  const url = getShowtimeListUrl(allocineCinemaId)
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
  console.log(
    'fetched screenings',
    showtimes.map((x) => x.scr[0].t)
  )

  return showtimes
}

module.exports = {
  getShowtimes,
}
