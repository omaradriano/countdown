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

//Objeto base que sirve para poner valores por defecto en caso de no existir ninguna fecha en el array
const defaultDate = {
    title: 'No hay informacion para mostrar',
    description: '',
    date: '0/0/2024'.split(/[\/-]/g),
    hour: '00:00'.split(/[:]/g),
    id: Math.random().toString(36).substr(2, 18)
}

// Se va a guardar un objeto en LocalStorage con las fechas en un array
let datesCollection = {
    activeDate: defaultDate,
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

    //Se activa setInterval en caso de haber fechas en el array
    if(JSON.parse(localStorage.getItem('datesCollection')).eventsList.length > 0){
        setInterval(()=>{

        },1000)
    }

    // if(addTitle.value === ''){
    //     let warningAdvice = document.createElement('div')
    // }

    //NOTA: los campos deben ser required | falta implementación
    newDate.title = addTitle.value
    newDate.description = addDesc.value
    newDate.date = addDate.value.split(/[\/-]/g)
    newDate.hour = addHour.value.split(/[:]/g)

    //Agrega el nuevo valor a la lista datesCollection y lo actualiza en localStorage
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

})
{/* <div class="info__datetime text--normal">
                                    ${elem.date[2]}/${elem.date[1]}/${elem.date[0]}
                                </div> */}

// Cargar lista de elementos en el DOM
function renderElements(data) {
    datesList.innerHTML = ''
    data.eventsList.forEach(elem => {
        let newItem = document.createElement('div')
        newItem.className = 'datesList__item d-flex flex-row align-items-center position-relative p-3'
        newItem.setAttribute('name', elem.id)
        newItem.setAttribute('id', elem.id)
        newItem.setAttribute('onclick', 'clickedItem(event)')
        newItem.innerHTML = `
                            <h3 class="item__title ms-3">${elem.title}</h3>
                            <div class="item__info d-flex flex-row position-absolute">
                                <div class="item__options ms-3">
                                    <input class='trashCanBtn' type='button' name='removeItem' onclick='removeItem(event)'/>
                                </div>
                            </div>
                            `
        datesList.appendChild(newItem)
    })
}

//Actualizar elemento de la lista con click
function clickedItem(e) {
    e.stopPropagation()
    // console.log(e.target.parentElement.parentElement.getAttribute('name') === elem.id)
    if(e.target.nodeName !== 'INPUT'){
        datesCollection.eventsList.forEach((elem, index)=>{
            if(e.target.parentElement.getAttribute('id') === elem.id || e.target.getAttribute('name') === elem.id || e.target.parentElement.parentElement.getAttribute('name') === elem.id){
                console.log(`Se ha presionado ${e.target.parentElement.getAttribute('id')}`)
                datesCollection.activeDate = datesCollection.eventsList[index]
                localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
                let actualDate = new Date(datesCollection.activeDate.date[0], datesCollection.activeDate.date[1] - 1, datesCollection.activeDate.date[2], ...datesCollection.activeDate.hour)
                returnLeftTime(actualDate, datesCollection)
            }
        })
    }
}
// ELiminar elemento de la lista
function removeItem(e) {
    e.stopPropagation()
    datesCollection.eventsList.forEach((elem, index) => {
        if (e.target.parentElement.parentElement.parentElement.getAttribute('name') === elem.id) { //Acceder al elemento, si coíncide será eliminado
            if(e.target.parentElement.parentElement.parentElement.getAttribute('name') === datesCollection.activeDate.id){ //Misma validación anterior pero con activeDate
                datesCollection.eventsList.splice(index, 1)
                localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
                if (datesCollection.eventsList.length === 0) {
                    datesCollection.activeDate = defaultDate
                    localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
                    let loadFirstDate = new Date()
                    returnLeftTime(loadFirstDate, datesCollection)
                } else {
                    datesCollection.activeDate = datesCollection.eventsList[0]
                    localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
                    let prevDate = new Date(datesCollection.activeDate.date[0], datesCollection.activeDate.date[1] - 1, datesCollection.activeDate.date[2], ...datesCollection.activeDate.hour)
                    returnLeftTime(prevDate, datesCollection)
                }
            }else{
                datesCollection.eventsList.splice(index, 1)
                localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
            }
        }
        // console.log(datesCollection)
        renderElements(datesCollection)
    })
    // console.log(e.target.parentElement.parentElement.parentElement.getAttribute('name'))
}
//Activa boton para borrar todo 
deleteAllDates.addEventListener('click', () => {
    datesCollection = {
        activeDate: defaultDate,
        eventsList: []
    }
    localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
    renderElements(datesCollection)
})
// Cargar los datos de la activeDate e imprimirlos en el DOM
function returnLeftTime(reachDate, data) {
    let actualDate = new Date()
    let leftedTime = ((reachDate.getTime() - actualDate.getTime()) / 1000)
    let daysLeft = Math.floor(leftedTime / 86400)
    let hoursLeft = Math.floor((leftedTime % 86400) / 3600)
    let minutesLeft = Math.floor(((leftedTime % 86400) % 3600) / 60)
    let secondsLeft = Math.floor(((leftedTime % 86400) % 3600) % 60)
    countdownBox__title.innerHTML = `${data.activeDate.title}`
    countdownBox__description.innerHTML = `${data.activeDate.description}`

    if (leftedTime < 0) {
        days.innerHTML = `0`
        hours.innerHTML = `00`
        minutes.innerHTML = `00`
        seconds.innerHTML = `00`
    } else {
        days.innerHTML = `${daysLeft}`
        hours.innerHTML = `${hoursLeft}`
        minutes.innerHTML = `${minutesLeft}`
        seconds.innerHTML = `${secondsLeft}`
    }
}

//Las lineas siguientes son para cortar las dos funciones onload anteriores pero aun no se ha implementado
window.onload = function () {
    if (!localStorage.getItem('datesCollection')) { //Si no existe colección, pone la fecha actual
        let defaultDate = new Date()
        localStorage.setItem('datesCollection', JSON.stringify(datesCollection))
        returnLeftTime(defaultDate, datesCollection)
    } else {
        datesCollection = JSON.parse(localStorage.getItem('datesCollection')) //Si hay colección, carga activeDate
        setInterval(() => {
            if (datesCollection.activeDate.date) {
                let fetchedActiveDate = new Date(datesCollection.activeDate.date[0], datesCollection.activeDate.date[1] - 1, datesCollection.activeDate.date[2], ...datesCollection.activeDate.hour)
                returnLeftTime(fetchedActiveDate, datesCollection)
            }
        },1000)
        renderElements(datesCollection)
    }
}