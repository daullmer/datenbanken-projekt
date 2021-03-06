let map = L.map('map').setView([42.361145, -71.057083], 13);
const hostname = "http://localhost:6001"

$("#datepicker").change(loadBikes);

$("#hour").change(loadBikes);

$("#bike_selector").change(loadMapByBikes);

function loadBikes() {
    val = $("#datepicker").val().split("-");
    year = val[0];
    month = val[1];
    day = val[2];
    hour = parseInt($("#hour").val())
    loadBikesInMap(year, month, day, hour);
}

function loadMapByBikes() {
    allLocsForBike($("#bike_selector option:selected").text());
}

// Slider to select Timestamps
var sliderControl = null;
var layerGroup = null;

var titleLayer = L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);

/**
 * Function to sort the data by date 
 */
function custom_sort(a, b) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}

function cleanSlider() {
    if(sliderControl != null){
	    // sliderControl.onRemove();
        sliders = $('.slider');
        for (i = 0; i < sliders.length; i++) {
            sliders[i].remove();
        }
    }
	// Remove the previously shown bikes when loading new ones
    map.eachLayer(function (layer) {
        if (layer != titleLayer) {
            map.removeLayer(layer);
        }
           
    });
}
// Add bikes to the Map at requesrted location and add the slider 
function addBikes(locations) {
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
}

// get Bike locations with requested Timestamp and have them added to the Map by addBikes(locations)
function loadBikesInMap(year, month, date, hour) {
    cleanSlider();
    getBikeByTimestamp(year, month, date, hour).then((bikesJson) => {
        if (bikesJson == null) {
            return;
        }
        locations = bikesJson['items'].sort(custom_sort);

        addBikes(locations);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    loadBikesInMap(2015, 1, 1, 14);
    var bikes = await getBikes();
    selector = $('#bike_selector')
    $.each(bikes, function(key, value) {   
        selector
            .append($("<option></option>")
                       .attr("value", key)
                       .text(value));
   });
}, false);

/**
 * Function call Database from Server for all availavle Bikes  
 */
async function getBikes() {  
    const response = await fetch(hostname + "/all_bikes");
    return response.json()
}
/**
 * Function call Database from Server for all availavle Bikes with requested ID
 */
async function getBikeById(id) {
    const response = await fetch(hostname + "/locations/" + id);
    return response.json()
}
/**
 * Function call Database from Server for all bikes with requested timestamp  
 */
async function getBikeByTimestamp(year, month, day, hour) {
    const response = await fetch(`${hostname}/dates/${year}/${month}/${day}/${hour}`);
    if (response.status != 200) {
        alert(`Keine Daten gefunden f??r Datum ${day}.${month}.${year} um ${hour} Uhr!`);
        return;
    }
    return response.json();
}

function allLocsForBike(bikeid) {
    cleanSlider();
    getBikeById(bikeid).then((bikesJson) => {
        locations = bikesJson['items'].sort(custom_sort);
        addBikes(locations);
    })
}
