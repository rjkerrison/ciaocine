const setup = ({ popupWithMessage }) => {
  function addToCalendar(event) {
    const button = event.target
    const { showtime } = button.dataset

    console.log('add to calendar', showtime)
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
    .forEach((button) => button.addEventListener('click', addToCalendar))
}

export default { setup }
