"use strict";

let map;

function initMap(results, mapElement, renderJobCard) {
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
        google.maps.event.addListener(marker, 'click', renderJobCard(job))
    }
}
