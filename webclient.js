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
	
	that.latitude  = 52.520816;
	that.longitude = 13.410186;
	
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
	}
	
	that.setAddress = function(address) {
		geocoder.geocode({"address": address}, function(result, status) {
			if (status != google.maps.GeocoderStatus.OK) {
				return;
			}
			that.setCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
			that.fire('position_changed');
		});
	}

	return that;
}

var WebClient = function(map) {
	var that = {};
	
	var SEND_HELP = '<li>Open Hoccer App on your mobile</li>' + 
	                '<li>Hit "Start Transfer" Button above</li>' +
	                '<li>Swipe over Hoccer canvas on your mobile</li>';
	var RECEIVE_HELP= '<li>Select content in Hoccer on your mobile</li>' + 
	                  '<li>Swipe it out of your mobile\'s screen</li>' +
	                  '<li>Hit "Start Transfer" Button above</li>'
	                  	
	HC.observable(that);
	
	var content;
	var active = true;
	var mode = "receiveMode";
	
	$("#send_mode_button").click(function() {
    mode = "sendMode"
    $("#content_select").slideDown();
    
    $("#receive_mode_button").css({'background': "url('images/receive_gray.png') no-repeat"});
	  $("#send_mode_button").css({'background': "url('images/send_blau.png') no-repeat"});
	  
	  $("#help").html(SEND_HELP);
	});
	
	$("#receive_mode_button").click(function() {
	  mode = "receiveMode"
	  $("#content_select").slideUp();
	  $("#receive_mode_button").css({'background': "url('images/receive_blau.png') no-repeat"});
	  $("#send_mode_button").css({'background': "url('images/send_gray.png') no-repeat"});
	  
	  $("#help").html(RECEIVE_HELP);
	});
	
	$("#transfer_button").click(function() {
	  if (!active) {
	    return;
	  }
	  
	  if (mode === "sendMode") {
	    that.fire('send');
	  } else {
	    that.fire('receive')
	  }
	});		
	
	$('#textcontent').bind('focus', function() {
    showTextMode();
	});
	
	$('#textcontent').focusout( function() {
    if ($(this).val() == "") {
      showBothModesFromTextMode();
    } else {
      content = { 'type': "text/plain", 'content': $(this).val() }
    }
	});
	
	$("#show_map > a").click(function() { 
	  var map_div =  $('#map_container');
	  if ( map_div.is(':hidden') || map_div.css('margin-top') == "-1000px" ) {
	    map_div
  	    .css({ 'position': 'static','display': 'none', 'margin': '0px' })
  	    .slideDown(500, function() { 
  	      map.show();
  	      $("#addressInput").focus();
  	    });
	  } else {
	    map_div.slideUp();
	  }
	});
	
	$("#fileInputField").change(function() {
    var file = document.getElementById('fileInputField').files[0];
    $(this).css({"z-index": 0});
    
    var filename = "";
    if(file.name.length > 38) {
      filename = file.name.substring(0, 17) + "..." + file.name.substring(file.name.length - 17);
    } else {
      filename = file.name;
    }
    
    $("#filename").html(filename + ' <a href="" id="cancelFile">(cancel)</a>');
    showFileMode();
    
    $("#cancelFile").click(function(event) {
      $("#filename").html("Select File");
      $("#fileInputField").css({"z-index": 2});
      
      showBothModesFromFileMode();
  	  event.stopPropagation();
  	  
  	  that.fire('file_canceled');
  	  return false;	  
  	});
  	
  	that.fire('file_selected', file);
	});
	
	$("#addressForm").submit( function(event) {
			map.setAddress($("#addressInput").val());
			event.stopPropagation();
			return false;
	});
	
	var showTextMode = function() {
    $("#fileinput").css({'display': 'none' });
    $("#content_select > section > span").css({'display': 'none'});
    $("#textcontent").animate({'width': "490px"});
	}
	
	var showBothModesFromTextMode = function() {
    $("#textcontent").animate({'width': "210px"}, function() {
      $("#fileinput").css({'display': 'block' });
      $("#content_select > section > span").css({'display': 'inline'});
    });
	}
	
	var showBothModesFromFileMode = function() {
    $("#fileinput").css({'width': "230px"});
    $("#textinput").css({'display': 'block'});
    $("#content_select > section > span").css({'display': 'inline'});
	}
	
	var showFileMode = function() {
	  $("#textinput").css({'display': 'none' });
    $("#content_select > section > span").css({'display': 'none'});
    $("#fileinput").css({'width': "605px"});
	}

	that.content = function() {
	  return content;
	}
	
	that.setContent = function(newContent) {
	  content = newContent;
	};

  that.connecting = function() {
    that.setInactive();
    $("#connecting_info")
              .text("Connecting...")
              .css({"visibility": "visible"});
  };

  that.unconnecting = function() {
    that.setActive();
    $("#connecting_info").css({"visibility": "hidden"});
  };
  
	that.displayLocation = function(location) {
		$("#waiting").css("display", "none");
		$("#coordinates").css("display", "inline");
	};
	
	that.showError = function(message) {
	  that.setActive();
	  $("#connecting_info")
	            .css({"visibiliy": "visible"})
	            .text(message);
		}
	
	that.showSuccess= function() {
	  // $("#transfer_button").css({'background': "url('images/transfer_successful.png') no-repeat" });
    $("#connecting_info")
	            .css({"visibiliy": "visible"})
	            .text("Transfer successful");
	}

  that.setInactive = function() {
	  active = false;
	  $("#transfer_button").css({'background': "url('images/inactive_transfer.png') no-repeat", 'cursor': 'default' });
	}
	
	that.setActive = function() {
	  active = true;
	  $("#transfer_button").css({'background': "url('images/start_transfer.png') no-repeat", 'cursor': 'pointer' });
	}

	return that;
}
