"use strict";


function displaySearchResults(results) {
    
    $("#search-results").empty();
    for (var id in results) {
        $("#search-results").append("<p>"+results[id]["company_name"]+"</p>");
        $("#search-results").append("<p>"+results[id]["title"]+"</p>");
    }
    
}

function searchJob(evt) {
    evt.preventDefault();

    let url = "/search.json";
    let formData = {"keyword": $("#keyword-field").val()};

    $.get(url, formData, displaySearchResults);
}

$('#search-form').on('submit', searchJob);