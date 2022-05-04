let map = L.map('map').setView([42.361145, -71.057083], 13);
const hostname = "http://localhost:6001"

L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);


document.addEventListener('DOMContentLoaded', function () {
    getBikeByTimestamp(2015, 1, 1, 14).then((vehiclesJson) => {
        locations = vehiclesJson['items'];
        
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];

            const icon = L.icon({
                iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Fahrrad.png",
                iconSize: [50, 50]
            });

            L.marker([location.lat, location.long], {icon: icon}).addTo(map).bindPopup(`
            <b>${location.bikeid}</b><br>
            VIN: ${location.bikeid}<br>
            
            `);
        }
    })
}, false);

async function getBikes() {  
    const response = await fetch(hostname + "/all_bikes");
    return response.json()
}

async function getBikeById(id) {
    const response = await fetch(hostname + "/locations/" + id);
    return response.json()
}

async function getBikeByTimestamp(year, month, day, hour) {
    const response = await fetch(`${hostname}/dates/${year}/${month}/${day}/${hour}`);
    return response.json()
}

