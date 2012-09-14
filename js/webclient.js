var WebClient = function(map) {
	var that = {};              	
	HC.observable(that);

	var content;
	var active = true;
	var mode = "";

	that.mode = function () {
		return mode;
	};
	that.active = function () {
		return active;
	};
	that.sendmode = function() {
		mode = "sendMode";
		return false;
	};
	that.receivemode = function() {
		if ( active ) {
			mode = "receiveMode";
		}
		return false;
	};


	// Webapp Help Intro
	$("#close_help").click( function() {
		that.hideHelp();
		that.setActive();
	});
	$("#close_help2").click( function() {
		that.hideHelp();
		that.setActive();
	});
	$("#help_link").click( function() {
		that.showHelp("force");
		that.setInactive();
	});

	// Change selected Client
	$("#change_client").click( function() {
		$("#group").slideDown(500, function() {});
		$("#webclient").slideUp(500, function() {});
		client.setInactive();
	});

	$('#close_text').click(function() {
		hideTextMode();
		$("#dropzone-wrapper").slideDown(500, function() {});
	});

	$('#set_text').click(function() {
		content = {
			'type': "text/plain",
			'content': $('#textcontent').val()
		}

		var filename = "";
        
		filename = $('#textcontent').val();

		if( filename.length > 38) {
			filename = filename.substring(0, 17) + "...";
		}

		$("#filename").html(filename + ' <a href="" id="cancelText">(cancel)</a>');

		$("#cancelText").click(function(event) {
			$("#filename").html("Nothing selected.");
			$("#start_sending").hide();
			$("#stop_sending").hide();
			$('.loading').css({'background-color':'#aaa'});
			$("#dropzone-wrapper").slideDown(500, function() {});
			that.fire("file_canceled");
			return false;
		});
		
		hideTextMode();
		that.sendmode();

		$("#stop_sending").show();
		$("#start_sending").hide();
	});

	$(".transfer_text").click(function() {
		showTextMode();
		$("#dropzone-wrapper").slideUp(500, function() {});

		/* prevent displaying after resizing screen up */
		setTimeout(function () {
			$("#dropzone-wrapper").hide();
		}, 500);
	});
	
	$("#show_map > a").click(function() { 
		var map_div =  $('#map_container');
		if ( map_div.is(':hidden') || map_div.css('margin-top') == "-1200px" ) {
			$("#show_map > a").text("Done");
			map_div
			.css({ 'position': 'static','display': 'none', 'margin': '0px' })
			.slideDown(500, function() { 
				map.show();
				$("#addressInput").focus();
			});
		} else {
			map_div.slideUp(500, function() {})
			$("#show_map > a").text("Location");
		}
		return false;
	});

	$("#start_sending").click(function() {
		that.sendmode();
		$('.loading').css({'background-color':'#a8e52e'});
		$("#start_sending").hide();
		$("#stop_sending").show();
	});

	$("#stop_sending").click(function() { 
		that.receivemode(); 
		if ( content.type == "text/plain" ) { 
			showTextMode(); 
		}
		$('.loading').css({'background-color':'#aaa'});
		$("#start_sending").show();
		$("#stop_sending").hide();
	});


	$(".fileInputField").change(function() {
		hideTextMode();
		that.receivemode();

		var file = document.getElementById('fileInputField1').files[0];
		if(!file) {
			var file = document.getElementById('fileInputField2').files[0];
		}
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
			$("#start_sending").hide();
			$("#stop_sending").hide();
			$('.loading').css({'background-color':'#aaa'});
			$("#dropzone-wrapper").slideDown(500, function() {});
			that.fire("file_canceled");
			
			return false;
		});

		$("#start_sending").show();
		$("#stop_sending").hide();

    
		that.fire('file_selected', file);
	});
	
	$("#addressForm").submit( function(event) {
			map.setAddress($("#addressInput").val());
			event.stopPropagation();
			return false;
	});

	var readCookie = function() {
		var name = "help_shown=";
		var bool = false;
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf("TRUE") != -1 ) {
				bool=true;
			}
		}
		return bool;
	};

	var setCookie = function() {
		document.cookie = "help_shown=TRUE";
		return;
	};

	var showTextMode = function() {
		$("#content_select").slideDown(500, function() {});
		$("#textcontent").focus();
	};

	var hideTextMode = function() {
		$("#content_select").slideUp(500, function() {});
	};
	
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
			.html("Waiting for sender...")
		} else {
			$("#connecting_info")
			.html("Sending content...")
		}
	};


	that.unconnecting = function() {};

	that.displayLocation = function(location) {
		$("#waiting").hide();
		$("#coordinates").css("display", "inline");
	};

	that.showHelp = function(_param) {
		if ( !readCookie() ) {
			setCookie();

			$("#help_wrapper").slideDown(500, function() {})
			$("#wrapper").slideUp(500, function() {})
		} else if ( readCookie() && _param == "force" ) {
			$("#help_wrapper").slideDown(500, function() {})
			$("#wrapper").slideUp(500, function() {})
		}
	};

	that.hideHelp = function() {
		$("#help_wrapper").slideUp(500, function() {});
		$("#wrapper").slideDown(500, function() {});
	};


	that.showError = function(message) {
		that.setActive();
		$("#connecting_info").text('ERROR: ' + message);
	};
	that.showSuccess= function() {
		$("#connecting_info").text("Transfer successful");
	};

	that.setInactive = function() {
		active = false;
	};
	that.setActive = function() {
		active = true;
	};

	return that;
}
