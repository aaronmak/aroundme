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
	      "source": {
	          "type": "geojson",
	          "data": dataArr[i]
	      }
	  });
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

// map.on('load', function () {
//     map.addSource('kindergartens', {
//         type: 'vector',
//         url: 'mapbox://aaronmak.2sty0d0t'
//     });
//     map.addLayer({
//         'id': 'kindergartens',
//         'type': 'circle',
//         'source': 'kindergartens',
//         'layout': {
//             'visibility': 'visible'
//         },
//         'paint': {
//             'circle-radius': 3,
//             'circle-color': 'rgba(55,148,179,1)'
//         },
//         'source-layer': 'kindergartens-6ypz8q'
//     });

//     map.addLayer({
//         "id": "terrain-data",
//         "type": "line",
//         "source": {
//             type: 'vector',
//             url: 'mapbox://mapbox.mapbox-terrain-v2'
//         },
//         "source-layer": "contour",
//         "layout": {
//             "line-join": "round",
//             "line-cap": "round"
//         },
//         "paint": {
//             "line-color": "#ff69b4",
//             "line-width": 1
//         }
//     });

//     map.addSource('contours', {
//         type: 'vector',
//         url: 'mapbox://mapbox.mapbox-terrain-v2'
//     });
//     map.addLayer({
//         'id': 'contours',
//         'type': 'line',
//         'source': 'contours',
//         'source-layer': 'contour',
//         'layout': {
//             'visibility': 'visible',
//             'line-join': 'round',
//             'line-cap': 'round'
//         },
//         'paint': {
//             'line-color': '#877b59',
//             'line-width': 1
//         }
//     });
// });

var dataArr = [cdcs, childCareServices, communityClubs, constituencyOffices, disabilityServices, eldercareServices, familyServices, kindergartens, preSchools, vwos]
var namesArr = ['CDCs', 'Child Care Services', 'Community Clubs', 'Constituency Offices', 'Disability Services', 'Eldercare Services', 'Family Services', 'Kindergartens','Pre Schools', 'VWOs']

map.on('load', function () {
	addAllLayers(dataArr, namesArr);
});

var toggleableLayerIds = namesArr;

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = (id);

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

map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
map.addControl(new mapboxgl.NavigationControl(), 'top-left');