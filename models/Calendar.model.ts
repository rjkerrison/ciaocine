import { Schema, model } from 'mongoose'

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  showtime: { type: Schema.Types.ObjectId, ref: 'Showtime' },
})

const Calendar = model('Calendar', schema)

export default Calendar
