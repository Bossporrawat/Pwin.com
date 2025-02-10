let map;
        let selectedLocation = null;
        let markers = { start: null, end: null };
        let directionsService;
        let directionsRenderer;

        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 14.071328, lng: 100.610503 }, // พิกัดของกรุงเทพฯ
                zoom: 15.5,
                gestureHandling: true, // ปิดการเลื่อนแผนที่ด้วยเมาส์ & ทัช
                zoomControl: true, // ปิดปุ่มควบคุมซูม
                streetViewControl: false, // ปิด Street View
                mapTypeControl: true // ปิดตัวเลือกประเภทแผนที่
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            // เมื่อผู้ใช้คลิกบนแผนที่
            map.addListener("click", function(event) {
                selectedLocation = event.latLng;
                document.getElementById("popup").style.display = "block"; // เปิดป๊อปอัป
            });
        }

        function setLocation(type) {
            if (!selectedLocation) return;

            // ลบหมุดเดิมถ้ามี
            if (markers[type]) {
                markers[type].setMap(null);
            }

            // ปักหมุดใหม่
            markers[type] = new google.maps.Marker({
                position: selectedLocation,
                map: map,
                label: type === "start" ? "S" : "E",
                title: type === "start" ? "จุดเริ่มต้น" : "จุดปลายทาง"
            });

            // ปิดป๊อปอัป
            document.getElementById("popup").style.display = "none";

            // ถ้ามีทั้ง Start และ End แล้ว ให้คำนวณเส้นทาง
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
                travelMode: "DRIVING" // เปลี่ยนเป็น "WALKING" หรือ "BICYCLING" ได้
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
            let route = result.routes[0].legs[0]; // ข้อมูลเส้นทาง
            let distanceText = route.distance.text; // ระยะทาง
            let durationText = route.duration.text; // ระยะเวลา
            let a=10,b=15,c=20;
            console.log(`${route.distance.value}`);
            if(route.distance.value <= 500){
                n = a;
            }
            else if(route.distance.value >= 500 && route.distance.value <= 2000){
                n = b;
            }
            else {
                n = c;
            }
            let priceText = n;
            document.getElementById("info").innerHTML = `🚗 ระยะทาง: ${distanceText} | ⏳ ใช้เวลา: ${durationText} | 💲 ราคา: ${priceText} Baht`;
        }