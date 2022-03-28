function expandShowtimes(event) {
  const button = event.target
  const movieElement = button.closest('.movie')
  const movieShowtimes = movieElement.querySelector('.movie-showtimes')
  movieShowtimes.classList.toggle('expanded')
  button.textContent = movieShowtimes.classList.contains('expanded')
    ? 'Hide'
    : 'Show more'
}

function setup() {
  document
    .querySelectorAll('button.expand-showtimes')
    .forEach((button) => button.addEventListener('click', expandShowtimes))
}

export default { setup }
