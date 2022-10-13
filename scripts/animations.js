// Botton para alternar el menu de fechas
const datesContainer = document.getElementById('datesContainer')
const toggleExpand = document.getElementById('toggleExpand')
let active = false
toggleExpand.addEventListener('click', () => {
    active = !active
    if(!active){
        datesContainer.style.top = '-15rem'
    }else{
        console.log('Activo')
        datesContainer.style.top = '0.5rem'
    }
})