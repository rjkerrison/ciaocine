import removeFromCalendar from '/js/removeFromCalendar.js'
import addToCalendar from '/js/addToCalendar.js'
import favouriteCinema from '/js/favouriteCinemas.js'
import expander from '/js/expander.js'
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
    expander.setup()
    removeFromCalendar.setup({ popupWithMessage })
    addToCalendar.setup({ popupWithMessage })
    favouriteCinema.setup({ popupWithMessage })
  },
  false
)
