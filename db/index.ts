// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
import { connect, Connection } from 'mongoose'

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

import { MONGO_URI } from '../utils/consts'

export const openConnection = async (): Promise<Connection> => {
  console.log('Opening database connection…')
  try {
    const thing = await connect(MONGO_URI)
    const x = thing
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    const connection = x.connections[0]
    return connection
  } catch (err) {
    console.error(err)
    throw `Error connecting to mongo: ${MONGO_URI}.`
  }
}
