const setup = () => {
  const popupContainer = document.querySelector('.popup-container')
  const popup = document.querySelector('.popup')

  const popupWithMessage = (message) => {
    popup.textContent = message
    popupContainer.classList.remove('bye-bye-bye')
    setTimeout(() => {
      popupContainer.classList.add('bye-bye-bye')
    }, 2000)
  }

  return {
    popupWithMessage,
  }
}

export default { setup }
