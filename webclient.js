var HoccerMap = function(id) {
	var that = {};
	HC.observable(that)
	
	var geocoder = new google.maps.Geocoder();
  var berlin = new google.maps.LatLng(52.520816, 13.410186);
	var myOptions = {
    zoom: 15,
    center: berlin,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById(id), myOptions);
	
	var marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP
  });
	
	var geocode = function() {
		geocoder.geocode({"latLng": new google.maps.LatLng(that.latitude, that.longitude) }, function(result, status) {
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
	
	that.visible = false;
	that.manualLocation = false;
	
	that.setCenter = function(latitude, longitude) {
		that.latitude = latitude;
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
		visible = true;
		
		if (!that.longitude) {
		  return;
		}
		
		var pos = new google.maps.LatLng(that.latitude, that.longitude);
		marker.setPosition(pos);
	}
	
	that.setAddress = function(address) {
		that.visible = false;
		geocoder.geocode({"address": address}, function(result, status) {
			if (status != google.maps.GeocoderStatus.OK) {
				return;
			}

			that.setCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
		});
	}

	return that;
}

var WebClient = function(map) {
	var that = {};
	HC.observable(that);
				
	$("#sendButton").click(function() { that.fire('send'); } );
	$("#receiveButton").click(function() {that.fire('receive') } );
	
	$("#show_map > a").click(function() { 
	  
	  $("#map_container").css({ 'display': 'none', 'margin': '0px' })
	                     .slideDown(500, function() { map.show() });
	  });
	
	$("#addressForm").submit( function(event) {
			map.setAddress($("#addressInput").val());
			event.stopPropagation();
			return false;
	});
				
	that.enableSend = function() {
	};
	
	that.enableReceive = function() {
	};
	
	that.displayLocation = function(location) {
		$("#waiting").css("display", "none");
		$("#coordinates").css("display", "inline");
	};
	
	that.showUploadingState = function() {
		// $("#").css("display": "none");	
	};
	
	that.uploadReady = function() {
		
	}
	
	return that;
}
