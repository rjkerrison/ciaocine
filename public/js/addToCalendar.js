const setup = ({ popupWithMessage }) => {
  function addToCalendar({ showtime }) {
    console.log('add to calendar', showtime)
    if (!showtime) {
      console.error('No showtime is present')
    }
    makeCalendarCall(showtime)
  }

  async function makeCalendarCall(id) {
    const config = {
      method: 'post',
      url: '/calendar',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id },
    }
    try {
      const response = await axios(config)
      console.log(response.data)
      popupWithMessage('Saved to your calendar!')
    } catch (error) {
      console.log(error)
    }
  }

  document
    .querySelectorAll('button.add-to-calendar[data-showtime]')
    .forEach((button) =>
      button.addEventListener('click', () => addToCalendar(button.dataset))
    )
}

export default { setup }
