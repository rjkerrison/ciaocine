const Cinema = require('../../models/Cinema.model')

const addSlugsToCinemas = async () => {
  // Rebuild indexes
  await Cinema.init()
  // Find
  const cinemas = await Cinema.find({ slug: { $exists: 0 } })
  console.log('Found %s cinemas without slugs.', cinemas.length)

  for (let cinema of cinemas) {
    const updatedCinema = await cinema.save()
    console.log('Updated cinema:', updatedCinema)
  }

  console.log(`Updated ${cinemas.length} cinemas.`)
}

module.exports = {
  addSlugsToCinemas,
}
