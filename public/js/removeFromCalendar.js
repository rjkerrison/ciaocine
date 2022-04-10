function setup({ popupWithMessage }) {
  function removeFromCalendar(event) {
    const button = event.target
    const { showtime } = button.dataset

    makeDeleteCalendarCall(showtime)
  }

  async function makeDeleteCalendarCall(id) {
    try {
      const config = {
        method: 'delete',
        url: `/calendar/${id}`,
      }
      const response = await axios(config)
      console.log(response.data)
      popupWithMessage('Successfully removed!')
      document.querySelector(`.calendar-entry[data-showtime="${id}"]`).remove()
    } catch (error) {
      console.log(error)
    }
  }

  document
    .querySelectorAll('button.remove-from-calendar')
    .forEach((button) => button.addEventListener('click', removeFromCalendar))
}

export default { setup }
