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
	var mode = ""

  that.mode = function () {
    return mode;
  }

  that.active = function () {
    return active;
  }


	that.sendmode = function() {

    $("#mode_info").html("SENDMODE - YOU CAN RECEIVE CONTENT ON THE SELECTED DEVICE");

    mode = "sendMode";

    return false;
	};
	
	that.receivemode = function() {
	  if ( active ) {
    mode = "receiveMode"
	  $("#content_select").slideUp();
	  
    $("#mode_info").text("RECEIVEMODE - YOU CAN RECEIVE CONTENT FROM THE SELECTED DEVICE");


    $("#help").html(RECEIVE_HELP);
	  
    }
	  return false;
	};

  $("#close_help").click( function() {
    that.hideHelp();
  });

  $("#help_link").click( function() {
    
    
    if ( active ) {
      that.setInactive();
      //$("#help_section").css({ 'display' : 'block' });
      $("#help_section").slideDown();
    } else if ( !active ) {
      that.setActive();
      $("#help_section").slideUp();
    }
  });

  $("#change_client").click( function() {
      $("#group").css({"display" : "block"});
      $("#webclient").css({"display" : "none"});
      client.setInactive();
  });

  $('#set_text').click(function() {

    content = { 'type': "text/plain", 'content': $('#textcontent').val() }
    
    var filename = "";
        
    filename = $('#textcontent').val();
    console.log(filename);
    $("#filename").html(filename + ' <a href="" id="cancelText">(cancel)</a>');

    $("#cancelText").click(function(event) {
      $("#filename").html("Nothing selected.");
      
      that.fire("file_canceled");
    });

    that.sendmode();

  });

  $("#transfer_text").click(function() {
      showTextMode();

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
      
      $("#filename").html("Nothing selected.");
      $("#fileInputField").css({"z-index": 2});
  	  
      that.fire("file_canceled");

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
	};

  that.connecting = function() {
    $("#connecting_info")
              .text("Connecting...")
              .css({"visibility": "visible"});
  };

  that.showwaiting = function() {
    if ( mode == "receiveMode" ) {
      $("#connecting_info")
              .text("Waiting for sender...")
    } else {
      $("#connecting_info")
              .text("Sending content...")
    }
  };


  that.unconnecting = function() {
    //$("#connecting_info").css({"visibility": "hidden"});
  };
  
	that.displayLocation = function(location) {
		$("#waiting").css("display", "none");
		$("#coordinates").css("display", "inline");
	};

  that.showHelp = function() {
    $("#help_wrapper").css({"display" : "block"});
    $("#map_container").css({"visibility" : "hidden"});
    $("#wrapper").css({"display" : "none"});
  }

  that.hideHelp = function() {
    $("#help_wrapper").css({"display" : "none"});
    $("#map_container").css({"visibility" : "visible"});
    $("#wrapper").css({"display" : "block"});
  }


	that.showError = function(message) {
	  that.setActive();
	  $("#connecting_info")
	            .text('ERROR: ' + message);
		}
	
	that.showSuccess= function() {
    $("#connecting_info")
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
