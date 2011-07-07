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

  that.mode = function () {
    return mode;
  }

	that.sendmode = function() {
		
    that.fire('send');

    return false;
	};
	
	that.receivemode = function() {
	  if ( active ) {
    mode = "receiveMode"
	  $("#content_select").slideUp();
	  
    $("#modeinfo").html("- READY TO RECIEVE");
	  $("#help").html(RECEIVE_HELP);
	  
    that.fire('receive')
    }
	  return false;
	};

  $("#change_client").click( function() {
      $("#group").css({"display" : "block"});
      $("#webclient").css({"display" : "none"});
      client.setInactive();
  });

  $('#cancel_text').click(function() {
    hideTextMode();
  })

  $('#send_text').click(function() {
    content = { 'type': "text/plain", 'content': $('#textcontent').val() }
    that.sendmode();
  });

  $("#transfer_text").click(function() {
    mode = "sendMode"
      showTextMode();

    $("#modeinfo").html("- READY TO SEND");

    $("#content_select").slideDown();
    
	  $("#help").html(SEND_HELP);
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

    $("#modeinfo").html("- READY TO SEND");

    hideTextMode();

    var file = document.getElementById('fileInputField').files[0];
    var filename = "";
        
    $(this).css({"z-index": 0});
    
    if(file.name.length > 38) {
      filename = file.name.substring(0, 17) + "..." + file.name.substring(file.name.length - 17);
    } else {
      filename = file.name;
    }

    
    $("#filename").html(filename + ' <a href="" id="cancelFile">(cancel)</a>');

    $("#cancelFile").click(function(event) {
      $("#filename").html("No file selected.");
      $("#fileInputField").css({"z-index": 2});
  	  
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
    $("#content_select > section > span").css({'display': 'none'});
    $("#textcontent").animate({'width': "490px"});
	}

  var hideTextMode = function() {
    $("#content_select").css({'display': 'none'});
  }
	
	that.content = function() {
	  return content;
	}

	that.setContent = function(newContent) {
	  content = newContent;
    that.sendmode();
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
    $("#connecting_info")
	            .css({"visibiliy": "visible"})
	            .text("Transfer successful");
	}

  that.setInactive = function() {
	  active = false;
	}
	
	that.setActive = function() {
	  active = true;
	}

	return that;
}
