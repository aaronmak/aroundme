// Utility Functions
function titleCase(str) {
	return str.split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ')
};

function unCamelCase(str1) {
	  // insert a space before all caps
    return str1.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); })
}

function setColor(element, color) {
    element.style.backgroundColor = color;
};

var colorbrewer = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']

function addAllLayers(dataArr, namesArr) {
	for (i=0; i < dataArr.length; i++) {
		map.addLayer({
	      "id": namesArr[i],
	      "type": "circle",
	      'paint': {
	          'circle-radius': 5,
	          'circle-color': colorbrewer[i]
	      },
	      'layout': {
            'visibility': 'none'
        },
	      "source": {
	          "type": "geojson",
	          "data": dataArr[i]
	      }
	  });
	}
}

function addPopup(layerId) {

  map.on('click', layerId, function(e) {
  	var popupContent = '';
  	if (e.features[0].properties.HYPERLINK) {
  		if (e.features[0].properties.HYPERLINK !== 'null') {
	  		popupContent = '<p>'+e.features[0].properties.NAME+'</p>'
							+'<p>'+e.features[0].properties.ADDRESS+'</p>'
							+"<a href='"+e.features[0].properties.HYPERLINK+"'>"+e.features[0].properties.HYPERLINK+'</a>';
			} else {
				popupContent = '<p>'+e.features[0].properties.NAME+'</p>'
						+'<p>'+e.features[0].properties.ADDRESS+'</p>'
			}
  	} else {
  		popupContent = '<p>'+e.features[0].properties.NAME+'</p>'
						+'<p>'+e.features[0].properties.ADDRESS+'</p>'
  	}
		new mapboxgl.Popup()
		  .setLngLat(e.features[0].geometry.coordinates)
		  .setHTML(popupContent)
		  .addTo(map);
	});

  map.on('mouseenter', layerId, function() {
      map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', layerId, function () {
        map.getCanvas().style.cursor = '';
    });
}

function addPopupList(layerIdArr) {
	for (i=0; i<layerIdArr.length; i++) {
		addPopup(layerIdArr[i]);
	}
}



// Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25tYWsiLCJhIjoiY2lqbW56MW41MDBhd3Q5a281cnczZzRxcCJ9.JJiANbdTxSUXpaUmQkXWDg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [103.84, 1.3147], // starting position
    zoom: 10 // starting zoom
});



var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

var currentLoc = new mapboxgl.GeolocateControl();

map.addControl(geocoder, 'top-left');
// map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
map.addControl(new mapboxgl.NavigationControl(), 'top-left');
map.addControl(currentLoc, 'bottom-left');

var dataArr = [cdcs, childCareServices, communityClubs, constituencyOffices, disabilityServices, eldercareServices, familyServices, kindergartens, preSchools, vwos]
var namesArr = ['CDCs', 'Child Care Services', 'Community Clubs', 'Constituency Offices', 'Disability Services', 'Eldercare Services', 'Family Services', 'Kindergartens','Pre Schools', 'VWOs']

map.on('load', function () {
	addAllLayers(dataArr, namesArr);
  addPopupList(namesArr);

 //  // add buffer polygon
 //  var pt = {
	//   "type": "Feature",
	//   "properties": {},
	//   "geometry": {
	//     "type": "Point",
	//     "coordinates": [103.84, 1.3147]
	//   },
	//   'paint': {
 //        'fill-color': '#088',
 //        'fill-opacity': 0.8
 //    }
	// };
	// var unit = 'kilometers';

	// var buffered = turf.buffer(pt, 5, unit);

  map.addSource('buffer', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "point",
        "source": "buffer",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#EF3C60",
            "circle-opacity": 0.5
        }
    });

    // map.addLayer({
    //     "id": "buffer5km",
    //     "source": "buffer",
    //     'type': 'fill',
    //     'data': buffered,
    //     "paint": {
    //     	'fill-color': '#088',
    //     	'fill-opacity': 0.8
    //     }
    // });

    // Listen for the `geocoder.input` event that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    geocoder.on('result', function(ev) {
        map.getSource('buffer').setData(ev.result.geometry);
        console.log(ev.result.geometry);
    });

    currentLoc.on('geolocate', function(ev) {
    	var curLatitude = ev.coords.latitude;
    	var curLongitude = ev.coords.longitude;
    	var pointObj = {
    		'type': "Point",
    		'coordinates': [curLongitude, curLatitude]
    	}
        map.getSource('buffer').setData(pointObj);
    });
});



var toggleableLayerIds = namesArr;

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.textContent = (id);
    link.style.borderLeft = '10px solid ' + colorbrewer[i];

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}