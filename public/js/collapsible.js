const toggleCollapsed = (collapsible, toggler) => {
  collapsible.classList.toggle('collapsed')
  toggler.classList.toggle('active')
}

const setupToggle = (toggleElement) => {
  const { target } = toggleElement.dataset
  const targetElement = document.getElementById(target)

  const toggleTarget = () => toggleCollapsed(targetElement, toggleElement)

  console.log(toggleElement, targetElement)

  toggleElement.addEventListener('click', toggleTarget)
}

const setup = () => {
  document.querySelectorAll('.collapse-toggle').forEach(setupToggle)
}

export default { setup }
