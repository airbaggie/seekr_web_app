"use strict";

let mapView = false;
let map;

function switchView() {
    if ($(this).is(':checked')) {
        mapView = $(this).is(':checked');
    }
    else {
        mapView = $(this).is(':checked');
    }
}
$("#map-view").on('change', switchView);


// $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
//   })


function displayJobDetail(evt) {
    // event.stopPropagation();
    alert(evt.company_name);
}
 

function getJobDetail(evt) {
    let url = "/jobs";
    let formData = {"key": evt.data.param};
    $.get(url, formData, displayJobDetail)
}


function displaySearchResults(results) {
    $("#search-results").empty();
    $("#map-canvas").hide();
    for ( const id in results) {
        if (results[id]["rating"] === 0 || results[id]["rating"] === null) {
            $("#search-results").append(`<div>
                                           <span class="card-company">${results[id]["company_name"]}</span>
                                           <p class="card-title">${results[id]["title"]}</p>
                                           <button type='button' id=${id} class='btn btn-primary card-button'>View Detail</button>
                                        </div>`);
        }
        else {
            $("#search-results").append(`<div>
                                           <span class="card-company">${results[id]["company_name"]}</span> <span class="badge badge-info company-rating">${results[id]["rating"]}</span>
                                           <p class='card-title'>${results[id]["title"]}</p>
                                           <button type='button' id=${id} class='btn btn-primary card-button'>View Detail</button>
                                        </div>`);
        }
        $('#'+id).click({param: id}, getJobDetail);


        // document.getElementById(id).click({param: id}, getJobDetail);


        // get function to get event taget attribute and set unique id, then call the job detail page
        // try use event.targer to track the element that user has clicked, grab the data from th attribute
    }
}


function showInfo(marker, job_info) {
    $("#map-canvas").fadeIn()
    let infowindow = new google.maps.InfoWindow({});
    return () => {
        let job_card = "<h5 class='card-title'>"+job_info["title"]+"</h5><p class='card-text'>"+job_info["company_name"]+"</p>"; 
        infowindow.setContent(job_card);
        infowindow.open(map, marker);

        // bug: infoWindow doesn't close properly
    }
}


function initMap(results) {
    $("#search-results").empty();
    let mapOptions = {
                      zoom: 11,
                      center: new google.maps.LatLng(37.6844462, -122.343031)
                     };
    let map = new google.maps.Map($("#map-canvas")[0], mapOptions);
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
    let url = "/search";
    let formData = {"keyword": $("#keyword-field").val()};

    if (mapView) {
        $.get(url, formData, initMap);
    }
    else {
        $.get(url, formData, displaySearchResults);
    }
}
$('#search-form').on('submit', searchJob);




// TODO: in detail window, click APPLY button to redirect to link
// TODO: in detail window, click SAVE button to redirect to login page / to save job (if user is active)



// store searching result in session ? global variable ? 