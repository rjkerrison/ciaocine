import Showtime from '../../models/Showtime.model'

const deleteAllShowtimes = async () => {
  const showtimes = await Showtime.deleteMany()
  console.log('Finished.')
  console.log(showtimes)
}

export { deleteAllShowtimes }
