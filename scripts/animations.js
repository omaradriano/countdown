// offcanvas

let offcanvasWindow = document.getElementById('offcanvasWindow')
let activeOutCanvas = document.getElementById('activeOutCanvas')
let window__close = document.getElementById('window__close')
let active = false
// offcanvasWindow.style.visibility = 'hidden';

activeOutCanvas.addEventListener('click', () => {
    active = true
    if (active) {
        offcanvasWindow.style.visibility = 'visible';
    }
})
window__close.addEventListener('click', () => {
    active = false
    if (!active) {
        offcanvasWindow.style.visibility = 'hidden';
    }
})