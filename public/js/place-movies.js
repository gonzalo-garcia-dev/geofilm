
let myMap

function init() {
    renderMap()
    getMovies()
}


function getMovies() {
    axios
        .get('/api/list')
        .then(response => setMarkers(response.data))
        .catch(error => { next(error) })
}



function setMarkers(movies) {

    movies.forEach(elm => {

        const lat = elm.location.coordinates[0]
        const lng = elm.location.coordinates[1]

        new google.maps.Marker({
            map: myMap,
            position: { lat, lng },
            title: elm.title,
            animation: google.maps.Animation.DROP

        })

    })
    // //Infowindow (quitar comentario cuando funcione todo)

    // const infoWindowOptions = {
    //     content: 'prueba de infowindow',
    //     position: { lat: 40.751791436975466, lng: -73.9754376213823 }
    // }

    // const infoWindow = new google.maps.infoWindow(infoWindowOptions)

    // const infoWindowOpenOptions = {
    //     map: myMap
    // }

    // infoWindow.open(infoWindowOpenOptions)

    // //Infowindow (quitar comentario cuando funcione todo)
}


function renderMap() {

    myMap = new google.maps.Map(
        document.querySelector('#myMap'),
        {
            zoom: 3,
            center: { lat: 40.4466299007422, lng: - 3.6746561949108187 }
        }
    )
}