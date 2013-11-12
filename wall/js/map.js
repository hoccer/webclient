var HoccerMap = function(id, addressFieldId) {
	var that = {};
	HC.observable(that)
	
	var geocoder = new google.maps.Geocoder();
	var berlin = new google.maps.LatLng(52.5167780325, 13.409039925);
	var styles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 32
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
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
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];
	/* [
		{
			stylers: [
				{ saturation: -50 }
			]
			},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{ lightness: 100 },
				{ visibility: "simplified" }
			]
			},{
			featureType: "road",
			elementType: "labels",
			stylers: [
				{ visibility: "on" }
			]
		}
	];
*/
	var myOptions = {
		zoom: 15,
		center: berlin,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: styles
	};

	var map = new google.maps.Map(document.getElementById(id), myOptions);
	
	var marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP
	});
	
	var geocode = function() {
		geocoder.geocode({
			"latLng": new google.maps.LatLng(that.latitude,
			that.longitude)
		}, function(result, status) {
			if (status != google.maps.GeocoderStatus.OK) {
				return;
			}
			that.fire('address_changed', result[0].formatted_address);
		});
	}
	
	google.maps.event.addListener(marker, 'dragend', function() {
		that.manualLocation = true;
		that.latitude = marker.getPosition().lat();
		that.longitude = marker.getPosition().lng();
		that.fire('position_changed');
		geocode();	
	});
	
	if (addressFieldId !== undefined) {
		var field = document.getElementById(addressFieldId);
		field.addEventListener('change', function() {
			that.setAddress(field.value);  
		}, true);
	}
	
	that.visible = false;
	that.manualLocation = false;
	
	that.latitude  = berlin.lat();
	that.longitude = berlin.lng();
	
	that.setCenter = function(latitude, longitude) {
		that.latitude  = latitude;
		that.longitude = longitude;
		geocode();
		
		var pos = new google.maps.LatLng(that.latitude, that.longitude);
		map.panTo(pos);
		if (that.visible) {
			marker.setPosition(pos);
		}
	}
	
	that.show = function() {
		google.maps.event.trigger(map, 'resize');
		that.visible = true;
		
		if (!that.longitude) {
			return;
		}

		var pos = new google.maps.LatLng(that.latitude, that.longitude);
		marker.setPosition(pos);
		map.panTo(pos);
	}
	
	that.setAddress = function(address) {
		geocoder.geocode({"address": address}, function(result, status) {
			if (status != google.maps.GeocoderStatus.OK) {
				return;
			}
			that.setCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
			that.fire('position_changed');
		});
	};

	that.map = function() {
		return map;
	}

	return that;
}
