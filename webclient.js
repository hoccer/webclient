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
	  
	  return false;
	});
	
	$("#receive_mode_button").click(function() {
	  mode = "receiveMode"
	  $("#content_select").slideUp();
	  $("#receive_mode_button").css({'background': "url('images/receive_blau.png') no-repeat"});
	  $("#send_mode_button").css({'background': "url('images/send_gray.png') no-repeat"});
	  
	  $("#help").html(RECEIVE_HELP);
	  
	  return false;
	});
	
	$("#transfer_button").click(function() {
	  if (!active) {
	    return false;
	  }
	  
	  if (mode === "sendMode") {
	    that.fire('send');
	  } else {
	    that.fire('receive')
	  }
	  return false;
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
	  if ( map_div.is(':hidden') || map_div.css('margin-top') == "-1200px" ) {
	    map_div
  	    .css({ 'position': 'static','display': 'none', 'margin': '0px' })
  	    .slideDown(500, function() { 
  	      map.show();
  	      $("#addressInput").focus();
  	    });
	  } else {
	    map_div.slideUp();
	  }
	  
	  return false;
	});
	
	$("#fileInputField").change(function() {
    var file = document.getElementById('fileInputField').files[0];
    var filename = "";
        
    $(this).css({"z-index": 0});
    
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
