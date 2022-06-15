import { Document, Model } from 'mongoose'

interface Cinema extends Document {
  allocine_id: String
  name: String
  address: String
  zipcode: String
  city: String
  member_cards: [memberCardSchema]
  slug: String
  geolocation: geolocationSchema
}

let cinema: Model<Cinema>

export = cinema
