"use strict";


function displaySearchResults(results) {
    
    $("#search-results").empty();
    for (var id in results) {
        if (results[id]["rating"] === 0 || results[id]["rating"] === null) {
            $("#search-results").append("<span>"+results[id]["company_name"]+"</span>");
            $("#search-results").append("<p class='title'>"+results[id]["title"]+"</p>");
            $("#search-results").append("<p>"+results[id]["apply_url"]+"</p>");
        }
        else {
            $("#search-results").append("<span>"+results[id]["company_name"]+"</span><span class='badge badge-info'>"+results[id]["rating"]+"</span>");
            $("#search-results").append("<p class='title'>"+results[id]["title"]+"</p>");
            $("#search-results").append("<p>"+results[id]["apply_url"]+"</p>");
        }
    }
}

function searchJob(evt) {
    evt.preventDefault();

    let url = "http://localhost:5001/search";
    let formData = {"keyword": $("#keyword-field").val()};

    $.get(url, formData, displaySearchResults);
}

$('#search-form').on('submit', searchJob);



// TODO: click job card to see detail window.
// not working right now.
function displayJobDetail() {
    alert('hey');
}

$('.title').on('mouseover', displayJobDetail);


// TODO: in detail window, click APPLY button to redirect to link
// TODO: in detail window, click SAVE button to redirect to login page /  to save job.