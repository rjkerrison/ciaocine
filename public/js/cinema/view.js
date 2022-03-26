document
  .querySelectorAll('button[data-showtime]')
  .forEach((button) => button.addEventListener('click', addToCalendar))

document.querySelectorAll('button[data-cinema]').forEach(setupCinemaButton)

function addToCalendar(event) {
  const button = event.target
  const { showtime } = button.dataset

  console.log('add to calendar', showtime)
  makeCalendarCall(showtime)
}

function setButtonText(button) {
  button.textContent = button.liked ? 'Unfavourite' : 'Favourite'
}

function setupCinemaButton(button) {
  button.liked = button.dataset.liked === 'true'
  setButtonText(button)
  button.addEventListener('click', favouriteCinema)
}

function favouriteCinema(event) {
  const button = event.target
  makeFavouriteCinemaCall(button)
}

async function makeCalendarCall(code) {
  const config = {
    method: 'post',
    url: '/calendar',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { code },
  }
  try {
    const response = await axios(config)
    console.log(response.data)
    popupWithMessage('Saved to your calendar!')
  } catch (error) {
    console.log(error)
  }
}

async function makeFavouriteCinemaCall(button) {
  const {
    dataset: { cinema },
    liked,
  } = button
  const config = {
    method: 'post',
    url: `/favourite/cinema/${cinema}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: { liked: !liked },
  }
  try {
    const {
      data: { liked },
    } = await axios(config)

    popupWithMessage(
      liked ? 'Favourited cinema!' : 'Removed cinema from your favourites'
    )
    button.liked = liked
    button.dataset.liked = liked
    setButtonText(button)
  } catch (error) {
    console.error(error)
  }
}
