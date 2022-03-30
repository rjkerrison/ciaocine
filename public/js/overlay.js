const containerClass = 'overlay-container'
const showOverlayClass = 'show-overlay'

const toggleShow = (container) => {
  console.log('TOGGLING SHOW', container)
  container.classList.toggle(showOverlayClass)
}

const setup = () => {
  const containers = document.querySelectorAll('.' + containerClass)
  containers.forEach((container) =>
    container.addEventListener('touchstart', () => toggleShow(container))
  )

  document.addEventListener('touchstart', ({ target }) =>
    console.log('touch', target)
  )
}

export default { setup }
