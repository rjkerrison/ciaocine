require('dotenv/config')

const { default: mongoose } = require('mongoose')
const Cinema = require('../models/Cinema.model')

const seedCinemaSlugs = async () => {
  await require('../db/index')
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

  return await mongoose.connection.close()
}

seedCinemaSlugs()
