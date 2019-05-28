"use strict";

// let mapView = false;
// let map;

// function switchView() {
//     if ($(this).is(':checked')) {
//         mapView = $(this).is(':checked');
//     }
//     else {
//         mapView = $(this).is(':checked');
//     }
// }
// $("#map-view").on('change', switchView);


function showInfo(marker, job_info) {
    $("#map").fadeIn()
    let infowindow = new google.maps.InfoWindow({});
    return () => {
        let job_card = "<h5 class='card-title'>"+job_info["title"]+"</h5><p class='card-text'>"+job_info["company_name"]+"</p>"; 
        infowindow.setContent(job_card);
        infowindow.open(map, marker);
    }
}


function initMap(results) {
    $("#job-cards").empty();
    let mapOptions = {
                      zoom: 11,
                      center: new google.maps.LatLng(37.6844462, -122.343031)
                     };
    let map = new google.maps.Map($("#map")[0], mapOptions);
    let marker, i;

    for (let id in results) {
        marker = new google.maps.Marker({
                 position: new google.maps.LatLng(results[id]["lat"], results[id]["lng"]),
                 map: map,
                })
        google.maps.event.addListener(marker, 'click', showInfo(marker, results[id]))
    }
}


function searchJob(evt) {
    evt.preventDefault();
    let url = "/searching";
    let formData = {"keyword": $("#keyword-field").val()};
    $.get(url, formData, initMap);
}
$('#search-form').on('submit', searchJob);

// if (mapView = true) {
//     $('#search-form').on('submit', searchJob);
// }













// function showInfo(marker, job_info) {
//     $("#map").fadeIn()
//     let infowindow = new google.maps.InfoWindow({});
//     return () => {
//         let job_card = "<h5 class='card-title'>"+job_info["title"]+"</h5><p class='card-text'>"+job_info["company_name"]+"</p>"; 
//         infowindow.setContent(job_card);
//         infowindow.open(map, marker);

//         // bug: infoWindow doesn't close properly
//     }
// }

// function initMap() {
//     let mapOptions = {
//                       zoom: 11,
//                       center: new google.maps.LatLng(37.6844462, -122.343031)
//                      };
//     let map = new google.maps.Map($("#map")[0], mapOptions);
//     let marker, i;

//     for (let id in results) {
//         marker = new google.maps.Marker({
//                  position: new google.maps.LatLng(results[id]["lat"], results[id]["lng"]),
//                  map: map,
//                 })
//         google.maps.event.addListener(marker, 'click', showInfo(marker, results[id]))
//     }
// }
// $("#map-view").on('change', initMap);
