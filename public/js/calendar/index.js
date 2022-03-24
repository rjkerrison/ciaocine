document
  .querySelectorAll('button')
  .forEach((button) => button.addEventListener('click', removeFromCalendar))

function removeFromCalendar(event) {
  const button = event.target
  const { calendar } = button.dataset

  console.log('add to calendar', calendar)
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
    alert('successfully removed')
    document.querySelector(`.calendar-entry[data-calendar="${id}"]`).remove()
  } catch (error) {
    console.log(error)
  }
}
