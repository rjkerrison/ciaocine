function expand({ target }) {
  const container = target.closest('.expander-container')
  const isExpanded = container.classList.toggle('expanded')

  target.textContent = isExpanded ? 'Hide' : 'Show more'
  container.scrollIntoView({
    behavior: 'smooth',
    block: isExpanded ? 'end' : 'start',
  })
}

function setup() {
  document
    .querySelectorAll('.expander')
    .forEach((button) => button.addEventListener('click', expand))
}

export default { setup }
