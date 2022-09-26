//Variables para cargar en el DOM
const days = document.getElementById('days')
const hours = document.getElementById('hours')
const minutes = document.getElementById('minutes')
const seconds = document.getElementById('seconds')
const countdownBox__title = document.getElementById('countdownBox__title')
const countdownBox__description = document.getElementById('countdownBox__description')

//Variables para guardar datos
const addTitle = document.getElementById('addTitle')
const addDesc = document.getElementById('addDesc')
const addDate = document.getElementById('addDate')
const addHour = document.getElementById('addHour')
const addDateButtton = document.getElementById('addDateButtton')
const formDate = [...document.getElementsByClassName('inputDates')]

// Variables para imprimir la lista en el DOM
const datesList = document.getElementById('datesList')
const deleteAllDates = document.getElementById('deleteAllDates')

// Variables para borrar item de la lista
const removeItemButton = document.getElementById('removeItemButton')
// Se va a guardar un objeto en LocalStorage con las fechas en un array

let datesCollection = {
    activeDate: {
        title: 'Default',
        description: 'Default',
        date: '0/0/2024',
        hour: '00:00',
        id: Math.random().toString(36).substr(2, 18)
    },
    eventsList: []
}

// Añadir fechas dinamicamente además de cargar la recién agregada como activeDate
addDateButtton.addEventListener('click', (e) => {
    e.preventDefault()
    let newDate = {
        title: '',
        description: '',
        date: '',
        hour: '',
        id: Math.random().toString(36).substr(2, 18)
    }

    //NOTA: los campos deben ser required | falta implementación
    newDate.title = addTitle.value
    newDate.description = addDesc.value
    newDate.date = addDate.value.split(/[\/-]/g)
    newDate.hour = addHour.value.split(/[:]/g)

    if (!localStorage.getItem('datesCollection')) {
        datesCollection.eventsList.push(newDate)
        datesCollection.activeDate = newDate
        localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
    } else {
        datesCollection = JSON.parse(localStorage.getItem('datesCollection'))
        datesCollection.eventsList.push(newDate)
        datesCollection.activeDate = newDate
        localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
    }
    //Reiniciar formulario
    formDate[0].reset()
    renderElements(datesCollection)
    console.log(datesCollection)

})

// Cargar lista de elementos en el DOM
function renderElements(data) {
    datesList.innerHTML = ''
    data.eventsList.forEach(elem => {
        let newItem = document.createElement('div')
        newItem.className = 'datesList__item'
        newItem.setAttribute('name', elem.id)
        newItem.innerHTML = `
                            <h3 class="item__title">${elem.title}</h3>
                            <div class="item__info">
                                <div class="info__datetime">
                                    ${elem.date[2]}/${elem.date[1]}/${elem.date[0]}
                                </div>
                                <div class="item__options">
                                    <input type='button' value='Eliminar' name='removeItem' onclick='removeItem(event)'/>
                                </div>
                            </div>
                            `
        datesList.appendChild(newItem)
    })
}

// ELiminar elemento de la lista
function removeItem(e) {
    datesCollection.eventsList.forEach((elem, index) => {
        if (e.target.parentElement.parentElement.parentElement.getAttribute('name') === elem.id) {
            // console.log(elem.id)
            // console.log(e.target.parentElement.parentElement.parentElement.getAttribute('name'))
            // console.log('Si coincide')
            datesCollection.eventsList.splice(index, 1)
            localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
        }
        if (datesCollection === []) {
            let loadFirstDate = new Date()

            returnLeftTime(loadFirstDate, datesCollection)
        }
        // console.log(datesCollection)
        renderElements(datesCollection)
    })
    // console.log(e.target.parentElement.parentElement.parentElement.getAttribute('name'))

}
//Activa boton para borrar todo 
deleteAllDates.addEventListener('click', () => {
    datesCollection = {
        activeDate: {
            title: 'Default',
            description: 'Default',
            date: '0/0/2024',
            hour: '00:00',
            id: Math.random().toString(36).substr(2, 18)
        },
        eventsList: []
    }
    localStorage.removeItem('datesCollection')
    renderElements(datesCollection)
})
// Cargar los datos de la activeDate e imprimirlos en el DOM
function returnLeftTime(reachDate, data) {
    let actualDate = new Date()
    let leftedTime = ((reachDate.getTime() - actualDate.getTime()) / 1000) - 3600
    let daysLeft = Math.floor(leftedTime / 86400)
    let hoursLeft = Math.floor((leftedTime % 86400) / 3600)
    let minutesLeft = Math.floor(((leftedTime % 86400) % 3600) / 60)
    let secondsLeft = Math.floor(((leftedTime % 86400) % 3600) % 60)

    countdownBox__title.innerHTML = `${data.activeDate.title}`
    countdownBox__description.innerHTML = `${data.activeDate.description}`
    days.innerHTML = `${daysLeft}`
    hours.innerHTML = `${hoursLeft}`
    minutes.innerHTML = `${minutesLeft}`
    seconds.innerHTML = `${secondsLeft}`
}

//Carga automático lo que hay en localStorage. En caso de existir un activeDate lo carga
window.onload = setInterval(() => {
    if (!localStorage.getItem('datesCollection')) { //Si no existe colección, pone la fecha actual
        let loadFirstDate = new Date()
        localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
        returnLeftTime(loadFirstDate, datesCollection)
    } else {
        datesCollection = JSON.parse(localStorage.getItem('datesCollection')) //Si hay colección, carga activeDate
        if (datesCollection.activeDate.date) {
            let fetchedActiveDate = new Date(datesCollection.activeDate.date[0], datesCollection.activeDate.date[1] - 1, datesCollection.activeDate.date[2], ...datesCollection.activeDate.hour)
            returnLeftTime(fetchedActiveDate, datesCollection)
            // console.log(datesCollection)
        }
    }
}, 1000);

window.onload = function () { //Esta función está exiliada por que render elements solo debe de ser cargado una vez para no mandar alv el DOM con tanta carga xd
    if (localStorage.getItem('datesCollection')) {
        let loadDomList = JSON.parse(localStorage.getItem('datesCollection'))
        renderElements(loadDomList)
    } else {
        datesList.innerHTML = 'No hay elementos para mostrar'
    }
}

//Las lineas siguientes son para cortar las dos funciones onload anteriores pero aun no se ha implementado

// window.onload = function () {
//     if (!localStorage.getItem('datesCollection')) {
//         let loadFirstDate = new Date()
//         localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
//         returnLeftTime(loadFirstDate, datesCollection)
//     } else {
//         datesCollection = JSON.parse(localStorage.getItem('datesCollection')) //Si hay colección, carga activeDate
//         setInterval(() => {
//             if (datesCollection.activeDate.date) {
//                 let fetchedActiveDate = new Date(datesCollection.activeDate.date[0], datesCollection.activeDate.date[1] - 1, datesCollection.activeDate.date[2], ...datesCollection.activeDate.hour)
//                 returnLeftTime(fetchedActiveDate, datesCollection)
//                 // console.log(datesCollection)
//             }
//         }, 1000)
//         renderElements(datesCollection)
//     }
// }