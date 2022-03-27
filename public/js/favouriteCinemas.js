const setup = ({ popupWithMessage }) => {
  function setButtonText(button) {
    if (button.liked) {
      button.classList.add('liked')
      button.textContent = 'STARRED'
      button.title = 'In your favourites'
    } else {
      button.classList.remove('liked')
      button.textContent = 'Star'
      button.title = 'Not in your favourites'
    }
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

  document
    .querySelectorAll('button.favourite-cinema[data-cinema]')
    .forEach(setupCinemaButton)
}

export default { setup }
