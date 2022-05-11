let map = L.map('map').setView([42.361145, -71.057083], 13);
const hostname = "http://localhost:6001"

$("#datepicker").change(loadBikes);

$("#hour").change(loadBikes);

function loadBikes() {
    val = $("#datepicker").val().split("-");
    year = val[0];
    month = val[1];
    day = val[2];
    hour = parseInt($("#hour").val())
    loadBikesInMap(year, month, day, hour);
}

var sliderControl = null;
var layerGroup = null;

var titleLayer = L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);

function custom_sort(a, b) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}

function loadBikesInMap(year, month, date, hour) {
    if(sliderControl != null){
	    // sliderControl.onRemove();
        sliders = $('.slider');
        for (i = 0; i < sliders.length; i++) {
            sliders[i].remove();
        }
    }

    map.eachLayer(function (layer) {
        if (layer != titleLayer) {
            map.removeLayer(layer);
        }
           
    });
    getBikeByTimestamp(year, month, date, hour).then((bikesJson) => {
        if (bikesJson == null) {
            return;
        }
        locations = bikesJson['items'].sort(custom_sort);
			
        markers = [];
        const icon = L.icon({
            iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Fahrrad.png",
            iconSize: [50, 50]
        });
        
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];

            date = location.date;
            marker = L.marker([location.lat, location.long], {icon: icon, time: location.timestamp}).addTo(map).bindPopup(`
            <b>Fahrrad ${location.bikeid}</b><br>
            ${location.date.day}.${location.date.month}.${location.date.year} um ${location.date.hour}:${location.date.minute}:${location.date.second} Uhr<br>
            `);
            
            markers.push(marker);
        }

        layerGroup = L.layerGroup(markers);
        sliderControl = L.control.sliderControl({layer:layerGroup});
        map.addControl(sliderControl);
        sliderControl.startSlider();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadBikesInMap(2015, 1, 1, 14);
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
    if (response.status != 200) {
        alert(`Keine Daten gefunden für Datum ${day}.${month}.${year} um ${hour} Uhr!`);
        return;
    }
    return response.json();
}

