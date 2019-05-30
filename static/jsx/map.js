"use strict";

let map;

function showInfo(marker, job) {
    let infowindow = new google.maps.InfoWindow({});
    return () => {
        let job_card = "<h5 class='card-title'>"+job["title"]+"</h5><p class='card-text'>"+job["company_name"]+"</p>"; 
        infowindow.setContent(job_card);
        infowindow.open(map, marker);
    }
}

function initMap(results, mapElement) {
    let mapOptions = {
                      zoom: 11,
                      center: new google.maps.LatLng(37.6844462, -122.343031)
                     };
    let map = new google.maps.Map(mapElement, mapOptions);
    let marker;

    for (let job of results) {
        marker = new google.maps.Marker({
                 position: new google.maps.LatLng(job["lat"], job["lng"]),
                 map: map,
                })
        google.maps.event.addListener(marker, 'click', showInfo(marker, job))
    }
}

