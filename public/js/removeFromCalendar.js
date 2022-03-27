function removeFromCalendar(event) {
  const button = event.target
  const { calendar } = button.dataset

  makeDeleteCalendarCall(calendar)
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
    document.querySelector(`.calendar-entry[data-calendar="${id}"]`).remove()
  } catch (error) {
    console.log(error)
  }
}

function setup() {
  document
    .querySelectorAll('button.remove-from-calendar')
    .forEach((button) => button.addEventListener('click', removeFromCalendar))
}

export default { setup }
