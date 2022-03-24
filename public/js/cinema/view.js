document
  .querySelectorAll('button')
  .forEach((button) => button.addEventListener('click', addToCalendar))

function addToCalendar(event) {
  const button = event.target
  const { showtime } = button.dataset

  console.log('add to calendar', showtime)
  makeCalendarCall(showtime)
}

async function makeCalendarCall(code) {
  let config = {
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
  } catch (error) {
    console.log(error)
  }
}
