const containerClass = 'overlay-container'
const showOverlayClass = 'show-overlay'

const toggleShow = (container) => {
  container.classList.toggle(showOverlayClass)
}

const setup = () => {
  const containers = document.querySelectorAll('.' + containerClass)
  containers.forEach((container) =>
    container.addEventListener('touchend', () => toggleShow(container))
  )
}

export default { setup }
