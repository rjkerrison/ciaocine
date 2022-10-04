const { getLocation } = require('../../api/geocode')
const { default: Cinema } = require('../../models/Cinema.model')

const addLocationsToCinemas = async () => {
  // Find
  const cinemas = await Cinema.find({ geolocation: { $exists: 0 } })
  console.log('Found %s cinemas without locations.', cinemas.length)

  for (let cinema of cinemas) {
    const geolocation = await getLocation(
      `${cinema.name} ${cinema.address}, ${cinema.zipcode}`,
      `${cinema.address}, ${cinema.zipcode}`,
      `${cinema.name}, ${cinema.zipcode}`
    )
    cinema.geolocation = geolocation
    const updatedCinema = await cinema.save()
    console.log('Updated cinema:', updatedCinema)
  }

  // Rebuild indexes
  await Cinema.init()

  console.log(`Updated ${cinemas.length} cinemas.`)
}

module.exports = {
  addLocationsToCinemas,
}
