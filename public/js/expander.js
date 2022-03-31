function expand({ target }) {
  const container = target.closest('.expander-container')
  container.classList.toggle('expanded')
  target.textContent = container.classList.contains('expanded')
    ? 'Hide'
    : 'Show more'
  container.scrollIntoView()
}

function setup() {
  document
    .querySelectorAll('.expander')
    .forEach((button) => button.addEventListener('click', expand))
}

export default { setup }
