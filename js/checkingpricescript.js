let map;
let markers = {};
let selectedLocation = null;
let directionsService, directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15.5,
        center: { lat: 14.071328, lng: 100.610503 },
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

    const outerCoords = [
        { lat: -90, lng: 0 }, { lat: 90, lng: 0 },
        { lat: 90, lng: 180 }, { lat: -90, lng: 180 },
    ];
    const innerCoords1 = [
        { lat: 14.078706, lng: 100.594131 },
        { lat: 14.078706, lng: 100.617528 },
        { lat: 14.065233, lng: 100.617528 },
        { lat: 14.065233, lng: 100.594131 },
    ];

    map.data.add({
        geometry: new google.maps.Data.Polygon([outerCoords, innerCoords1]),
    });

    map.data.setStyle({
        fillColor: "red",
        strokeColor: "black",
        strokeWeight: 2,
        fillOpacity: 0.5,
    });

    let wasClickedInside = false;

    // ตรวจจับการคลิกภายในโพลิกอน
    map.data.addListener("click", function (event) {
        alert("ผิดแล้ว")
    });

    // ตรวจจับการคลิกนอกโพลิกอน
    google.maps.event.addListener(map, "click", function (event) {
        setTimeout(() => {
            if (!wasClickedInside) {
                selectedLocation = event.latLng;
                showPopup();
            }
            wasClickedInside = false;
        }, 100);
    });
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function setLocation(type) {
    if (!selectedLocation) return;

    if (markers[type]) {
        markers[type].setMap(null);
    }

    markers[type] = new google.maps.Marker({
        position: selectedLocation,
        map: map,
        label: type === "start" ? "S" : "E",
        title: type === "start" ? "จุดเริ่มต้น" : "จุดปลายทาง"
    });

    closePopup();

    if (markers.start && markers.end) {
        calculateRoute();
    }
}

function calculateRoute() {
    let start = markers.start.getPosition();
    let end = markers.end.getPosition();

    let request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING"
    };

    directionsService.route(request, function(result, status) {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            displayDistance(result);
        } else {
            alert("ไม่สามารถคำนวณเส้นทางได้: " + status);
        }
    });
}

function displayDistance(result) {
    let route = result.routes[0].legs[0]; 
    let distanceText = route.distance.text; 
    let durationText = route.duration.text; 
    let price;

    if(route.distance.value <= 500){
        price = 10;
    } else if(route.distance.value <= 2000){
        price = 15;
    } else {
        price = 20;
    }

    document.getElementById("info").innerHTML = 
      `🚗 ระยะทาง: ${distanceText} | ⏳ ใช้เวลา: ${durationText} | 💲 ราคา: ${price} Baht`;
}