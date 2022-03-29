const toggleCollapsed = (collapsible) => {
  collapsible.classList.toggle('collapsed')
}

const setupToggle = (toggleElement) => {
  const { target } = toggleElement.dataset
  const targetElement = document.getElementById(target)
  const toggleTarget = () => toggleCollapsed(targetElement)

  console.log(toggleElement, targetElement)

  toggleElement.addEventListener('click', toggleTarget)
}

const setup = () => {
  document.querySelectorAll('.collapse-toggle').forEach(setupToggle)
}

export default { setup }
