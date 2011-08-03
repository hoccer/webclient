var WebClient = function(map) {
	var that = {};
	
                  	
	HC.observable(that);
	
	var content;
	var active = true;
	var mode = ""
  var iv = [0];


  that.mode = function () {
    return mode;
  }

  that.active = function () {
    return active;
  }


	that.sendmode = function() {

    mode = "sendMode";

    return false;
	};
	
	that.receivemode = function() {
	  if ( active ) {
    mode = "receiveMode"
    }
	  return false;
	};

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

  $("#change_client").click( function() {
      $("#group").css({"display" : "block"});
      $("#webclient").css({"display" : "none"});
      client.setInactive();
  });

  $('#close_text').click(function() {
      hideTextMode();
  });

  $('#set_text').click(function() {
    var check = document.getElementById("check_encryption");

    if ( check.checked ) { 
      var salt = Crypto.util.randomBytes(32);
      var txt = that.aes_encrypt($('#textcontent').val(),"12345678", Crypto.util.bytesToBase64(salt));
      content = { 'type': "text/plain", "encryption" : that.buildEncJSON("SHA256",256,"AES",Crypto.util.bytesToBase64(salt)), 'content': txt }
      console.log(content);
    } else {
      content = { 'type': "text/plain", 'content': $('#textcontent').val() }
    }

    var filename = "";
        
    filename = $('#textcontent').val();

    if( filename.length > 38) {
      filename = filename.substring(0, 17) + "...";
    } 

    $("#filename").html(filename + ' <a href="" id="cancelText">(cancel)</a>');

    $("#cancelText").click(function(event) {
      $("#filename").html("Nothing selected.");
      $("#start_sending").css({ "display" : "none" });
      $("#stop_sending").css({ "display" : "none" });
      
      that.fire("file_canceled");
    });
    hideTextMode();
    that.sendmode();
    $("#stop_sending").css({ "display" : "block" });
    $("#start_sending").css({ "display" : "none" });
  });

  $("#transfer_text").click(function() {
      showTextMode();

      $("#content_select").css({ "display" : "block" });
    //$("#content_select").slideDown();
    
  });
	
	$("#show_map > a").click(function() { 
	  var map_div =  $('#map_container');
	  if ( map_div.is(':hidden') || map_div.css('margin-top') == "-1200px" ) {
      $("#show_map > a").text("Close");
	    map_div
  	    .css({ 'position': 'static','display': 'none', 'margin': '0px' })
  	    .slideDown(500, function() { 
  	      map.show();
  	      $("#addressInput").focus();
  	    });
	  } else {
	    map_div.slideUp();
      $("#show_map > a").text("Change");
	  }
	  
	  return false;
	});

  $("#start_sending").click(function() {
    that.sendmode();
    $("#start_sending").css({ "display" : "none" });
    $("#stop_sending").css({ "display" : "block" });
  });  

  $("#stop_sending").click(function() { 
    that.receivemode(); 

    if ( content.type == "text/plain" ) { 
      showTextMode(); 
      //$("#content_select").slideDown();
    } 

    $("#start_sending").css({ "display" : "block" });
    $("#stop_sending").css({ "display" : "none" });
  });

	$("#fileInputField").change(function() {

    hideTextMode();
    that.receivemode();

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
      $("#start_sending").css({ "display" : "none" });
      $("#stop_sending").css({ "display" : "none" });

  	  
      that.fire("file_canceled");

  	  return false;	  
  	});

    $("#start_sending").css({ "display" : "block" });
    $("#stop_sending").css({ "display" : "none" });

    
  	that.fire('file_selected', file);
	});
	
	$("#addressForm").submit( function(event) {
			map.setAddress($("#addressInput").val());
			event.stopPropagation();
			return false;
	});

  that.buildEncJSON = function(hash,keysize,method,salt) {
    var jsn = { "hash" : hash , "keysize" : keysize , "method" : method , "salt" : salt};

    return jsn;
  }

  that.aes_encrypt = function(content,pass,salt) {

    var pre_key = Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(pass)) + Crypto.util.bytesToHex(Crypto.util.base64ToBytes(salt));
    var key256bit = Crypto.PBKDF2(pass, salt, 32);
    console.log("preykey (HEX): " + pre_key);
    console.log("preykey (new method): " + key256bit);
    console.log("preykey (Bytes): " + Crypto.util.hexToBytes(pre_key));
    var keyhash = Crypto.SHA256( Crypto.util.hexToBytes(pre_key) , { asByte: true });
    console.log("Hash(SHA256): " + keyhash );
    console.log("initial vector length: " + iv.length);
    var crypted = Crypto.AES.encrypt(content, Crypto.util.hexToBytes(keyhash) , { mode: new Crypto.mode.CBC(Crypto.pad.pkcs7), iv : iv });
    console.log("encrypted data: " + crypted);
    var plain = that.aes_decrypt(crypted,"password",salt);
    console.log("decrypted data: " + plain);

    return crypted;
  }

  that.aes_decrypt = function(content,pass,salt) {
    
    var pre_key = Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(pass)) + Crypto.util.bytesToHex(Crypto.util.base64ToBytes(salt));
 
    console.log("preKey (HEX): " + pre_key);
    console.log("preykey (Bytes): " + Crypto.util.hexToBytes(pre_key));
    var keyhash = Crypto.SHA256( Crypto.util.hexToBytes(pre_key) , { asByte: true });
    console.log( "hash(SHA256): " + keyhash );
    
    console.log("cryptedText (base64): " + content );
    console.log("cryptedText (utf8): " + Crypto.charenc.Binary.bytesToString(Crypto.util.base64ToBytes(content )));

    var plain = Crypto.AES.decrypt(content, Crypto.util.hexToBytes(keyhash) , { mode: new Crypto.mode.CBC(Crypto.pad.pkcs7), iv : iv });
    
    return plain;
  }

  that.readCookie = function(reason) {
      if ( reason == "help_shown" ) {
        var name = "help_shown=";
        var bool = false;
        var ca = document.cookie.split(';');
    	  for(var i=0;i < ca.length;i++) {
	    	  var c = ca[i];
		      while (c.charAt(0)==' ') c = c.substring(1,c.length);
		      if (c.indexOf("TRUE") != -1 ) { bool=true; }
 	      }

        return bool;
      } else if ( reason == "app_name" ) {
        var name = "app_name=";
        var ca = document.cookie.split(';');
    	  for(var i=0;i < ca.length;i++) {
	    	  var c = ca[i];
		      while (c.charAt(0)==' ') c = c.substring(1,c.length);
		      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
 	      }
      } else { return false; }

  }

  that.setCookie = function(property,value) {
      
      var today = new Date();
      today.setTime( today.getTime() );

      var x = 356;
      var exp = x * 1000 * 60 * 60 * 24;
      var exp_date = new Date( today.getTime() + (exp) );

      document.cookie = property + "=" + value + ";expires=" + exp_date.toGMTString();
      
      return;
  }

  that.deleteCookie = function(property) {
    if ( that.readCookie(property) ) document.cookie = property + "=" + ";expires=Thu, 01-Jan-2000 00:00:01 GMT";
  }
  


	var showTextMode = function() {
    $("#content_select > section > span").css({'display': 'none'});
    $("#content_select").css({ "display" : "block" });
    $("#textcontent").focus();
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
              .text("Connecting... <img id='connecting_animation' src='images/loading.gif'/>")
              .css({"visibility": "visible"});
  };

  that.showwaiting = function() {
    if ( mode == "receiveMode" ) {
      $("#connecting_info")
              .html("Waiting for sender... <img id='connecting_animation' src='images/loading.gif'/> ")
    } else {
      $("#connecting_info")
              .html("Sending content... <img id='connecting_animation' src='images/loading.gif'/> ")
    }
  };


  that.unconnecting = function() {
  };
  
	that.displayLocation = function(location) {
		$("#waiting").css("display", "none");
		$("#coordinates").css("display", "inline");
	};

  that.showHelp = function(_param) {
    
    if ( !that.readCookie("help_shown") ) {
      that.setCookie("help_shown","TRUE");

      $("#help_wrapper").css({"display" : "block"});
      $("#map_container").css({"visibility" : "hidden"});
      $("#wrapper").css({"display" : "none"});
    } else if ( that.readCookie("help_shown") && _param == "force" ) {
      $("#help_wrapper").css({"display" : "block"});
      $("#map_container").css({"visibility" : "hidden"});
      $("#wrapper").css({"display" : "none"});
    }
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
