var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerColor(mag) {
    // console.log(mag);
    switch (true) {
        case mag > 5.:
            return 'rgb(240, 107, 107)';
        case mag > 4.:
            return 'rgb(240, 167, 107)';
        case mag > 3.:
            return 'rgb(243, 186, 77)';
        case mag > 2.:
            return 'rgb(243, 219, 77)';
        case mag > 1.:
            return 'rgb(225, 243, 77)';
        default: // 0-1
            return 'rgb(183, 243, 77)';
    }

}

// Perform a GET request to the query URL
d3.json(link, function(data) {
 
    // Creating a geoJSON layer with the retrieved data
    var earthquakes = L.geoJSON(data.features, {

        onEachFeature : function (feature, layer) {
            layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function(event) {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: 0.9
                  });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function(event) {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: 0.5
                  });
                },
              });
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + 
                                Date(feature.properties.time) + "</br>" + 
                                "Magnitude: " +  feature.properties.mag + "</p>")
        },
        
        // Using pointToLayer to drawn circle marker
        pointToLayer: function (feature, latlng) {


            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 20000,
                fillColor: markerColor(feature.properties.mag),
                color: "black",
                weight: .5,
                opacity: 1,
                fillOpacity: 0.5
            };
            
            return L.circle(latlng, geojsonMarkerOptions);


        }
    });
    


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);


});


function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "streets-v11",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });


    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap,
        "Street Map": streetmap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
        // ,
        // "Tectonic Plates": plates
    };

    // Create the map object with options
    var myMap = L.map("map", {
        center: [36.1699, -115.1398],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
    var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        labels =[]   
        magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> &nbsp' +  magnitudes[i] + (magnitudes[i + 1] ? '-' + magnitudes[i + 1] : '+ '));
            }
            div.innerHTML = labels.join('<br>');
        return div;
    };
    
    legend.addTo(myMap);

}


