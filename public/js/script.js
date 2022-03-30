import removeFromCalendar from '/js/removeFromCalendar.js'
import addToCalendar from '/js/addToCalendar.js'
import favouriteCinema from '/js/favouriteCinemas.js'
import expandShowtimes from '/js/expandShowtimes.js'
import popupMessage from '/js/popupMessage.js'
import collapsible from './collapsible.js'
import overlay from './overlay.js'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('ciaocine JS imported successfully!')
    const { popupWithMessage } = popupMessage.setup()

    overlay.setup()
    collapsible.setup()
    expandShowtimes.setup()
    removeFromCalendar.setup({ popupWithMessage })
    addToCalendar.setup({ popupWithMessage })
    favouriteCinema.setup({ popupWithMessage })
  },
  false
)
