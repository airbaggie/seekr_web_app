"use strict";

let map;

function initMap(results, mapElement, renderJobCard) {
    let styledMapType = new google.maps.StyledMapType(
        [
            {
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#f5f5f5"
                }
            ]
            },
            {
            "elementType": "labels.icon",
            "stylers": [
                {
                "visibility": "off"
                }
            ]
            },
            {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#616161"
                }
            ]
            },
            {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                "color": "#f5f5f5"
                }
            ]
            },
            {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#bdbdbd"
                }
            ]
            },
            {
            "featureType": "administrative.locality",
            "elementType": "labels.text",
            "stylers": [
                {
                "weight": 3
                }
            ]
            },
            {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text",
            "stylers": [
                {
                "color": "#d9b310"
                },
                {
                "saturation":30
                },
                {
                "lightness": 0
                },
                {
                "visibility": "simplified"
                },
                {
                "weight": 3.5
                }
            ]
            },
            {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "visibility": "simplified"
                },
                {
                "weight": 5
                }
            ]
            },
            {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#eeeeee"
                }
            ]
            },
            {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#757575"
                }
            ]
            },
            {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#e5e5e5"
                }
            ]
            },
            {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#9e9e9e"
                }
            ]
            },
            {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#ffffff"
                }
            ]
            },
            {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#757575"
                }
            ]
            },
            {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#dadada"
                }
            ]
            },
            {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#616161"
                }
            ]
            },
            {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#9e9e9e"
                }
            ]
            },
            {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#e5e5e5"
                }
            ]
            },
            {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#eeeeee"
                }
            ]
            },
            {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                "color": "#c9c9c9"
                }
            ]
            },
            {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                "color": "#daedf7"
                },
                {
                "weight": 1
                }
            ]
            },
            {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                "color": "#9e9e9e"
                }
            ]
            }
        ],
        {name: 'Styled Map'});

    let mapOptions = {
                      zoom: 13,
                      center: new google.maps.LatLng(37.7791405,-122.4365057),
                      mapTypeControlOptions: {
                        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                                'styled_map']
                     }
                     };
    let map = new google.maps.Map(mapElement, mapOptions);
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

    let marker;

    for (let job of results) {
        marker = new google.maps.Marker({
                 position: new google.maps.LatLng(job["lat"], job["lng"]),
                 map: map,
                })
        google.maps.event.addListener(marker, 'click', renderJobCard(job))
    }
}
