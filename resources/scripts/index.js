
var images = [];
var current = 0;



function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -41.295778, lng: 174.777},
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        //41°17'44.8"S 174°46'37.2"E

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];

        //localStorage.clear();

        if (localStorage) {
          for (var i = 0; i < localStorage.length; i++){
            var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
            var data = {
              title: item.title,
              lat: item.lat,
              lng: item.lng
            }


            var lat = new google.maps.LatLng(data.lat, data.lng);

            var marker = new google.maps.Marker({
              map: map,
              title: data.title,
              position: lat
            });

            var add = true;

            for (var i = 0; i < markers.length; i++) {
              if (markers[i] === marker){add = false};
            }

            if (add){markers.push(marker);}

          }
        }

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // // Clear out the old markers.
          // markers.forEach(function(marker) {
          //   marker.setMap(null);
          // });
          // markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              title: place.name,
              position: place.geometry.location
            }));

            localStorage.clear();

            for (var i = 0; i < markers.length; i++) {
              var data = {
                title: markers[i].title,
                lat: markers[i].position.lat(),
                lng: markers[i].position.lng()
              }
              localStorage[localStorage.length] = JSON.stringify(data);
              //console.log(localStorage);       
            }


            //Add local storage of multiple markers in the form JSON.stringify(marker)

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }
