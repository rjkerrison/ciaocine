// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
import mongoose from 'mongoose'

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

import { MONGO_URI } from '../utils/consts'

const connection = mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    return x.connections[0]
  })
  .catch((err) => {
    console.error(`Error connecting to mongo: ${MONGO_URI}.`)
    throw err
  })

export default connection
