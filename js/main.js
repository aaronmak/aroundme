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
	          'circle-radius': 3,
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

var dataArr = [cdcs, childCareServices, communityClubs, constituencyOffices, disabilityServices, eldercareServices, familyServices, kindergartens, preSchools, vwos]
var namesArr = ['CDCs', 'Child Care Services', 'Community Clubs', 'Constituency Offices', 'Disability Services', 'Eldercare Services', 'Family Services', 'Kindergartens','Pre Schools', 'VWOs']

map.on('load', function () {
	addAllLayers(dataArr, namesArr);
  addPopupList(namesArr);
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

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}), 'top-left');
// map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
map.addControl(new mapboxgl.NavigationControl(), 'top-left');
// map.addControl(new mapboxgl.GeolocateControl(), 'bottom-left');