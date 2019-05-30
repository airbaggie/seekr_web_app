"use strict";

// let mapView = false;
let map;

// function switchView() {
//     if ($(this).is(':checked')) {
//         mapView = $(this).is(':checked');
//     }
//     else {
//         mapView = $(this).is(':checked');
//     }
// }
// $("#map-view").on('change', switchView);


// function displayJobDetail(evt) {
//     // event.stopPropagation();
//     alert(evt.company_name);
// }
 

// function getJobDetail(evt) {
//     let url = "/jobs";
//     let formData = {"key": evt.data.param};
//     $.get(url, formData, displayJobDetail)
// }


// function displaySearchResults(results) {
//     $("#search-results").empty();
//     $("#map-canvas").hide();
//     for ( const id in results) {
//         if (results[id]["rating"] === 0 || results[id]["rating"] === null) {
//             $("#search-results").append(`<div>
//                                            <span class="card-company">${results[id]["company_name"]}</span>
//                                            <p class="card-title">${results[id]["title"]}</p>
//                                            <button type='button' id=${id} class='btn btn-primary card-button'>View Detail</button>
//                                         </div>`);
//         }
//         else {
//             $("#search-results").append(`<div>
//                                            <span class="card-company">${results[id]["company_name"]}</span> <span class="badge badge-info company-rating">${results[id]["rating"]}</span>
//                                            <p class='card-title'>${results[id]["title"]}</p>
//                                            <button type='button' id=${id} class='btn btn-primary card-button'>View Detail</button>
//                                         </div>`);
//         }
//         $('#'+id).click({param: id}, getJobDetail);

//     }
// }


function showInfo(marker, job) {
    // $("#map-canvas").fadeIn()
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
    let marker, i;

    for (let job in results) {
        marker = new google.maps.Marker({
                 position: new google.maps.LatLng(job["lat"], job["lng"]),
                 map: map,
                })
        google.maps.event.addListener(marker, 'click', showInfo(marker, job))
    }
}