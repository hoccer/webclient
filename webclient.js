var WebClient = function(map) {
	var that = {};
	
                  	
	HC.observable(that);
	
	var content;
	var active = true;
	var mode = ""
  var iv = [0];
  var psk =""
  var selected_pubkey = "";
  var selected_client = [];


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

  that.pubkey = function(_pubkey) {

    if ( _pubkey ) { selected_pubkey = _pubkey }

    return selected_pubkey;
  }

  that.selected_client = function(_client) {

    if ( _client ) { selected_client = _client }
    return selected_client;
  }

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

      console.log(that.pubkey());

      var en = client.decPublicKey(Crypto.util.base64ToBytes(that.pubkey()))[0];
      var exp = client.decPublicKey(Crypto.util.base64ToBytes(that.pubkey()))[1];

      console.log(en);
      console.log(exp);

      rsa.setPublic(Crypto.util.bytesToBase64(en), Crypto.util.bytesToBase64(exp));

      var encpsk = rsa.encrypt(psk);

      var txt = that.aes_encrypt($('#textcontent').val(),psk, Crypto.util.bytesToBase64(salt));
      content = { 'type': "text/plain", "encryption" : that.buildEncJSON("SHA256",256,"AES",Crypto.util.bytesToBase64(salt), encpsk), 'content': txt }
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

  that.setPSK = function(_psk) {
    if ( _psk == "" && psk == "" ) { 
      psk = Crypto.util.bytesToBase64(Crypto.util.randomBytes(32)); return psk;
    } else if ( _psk == "" && psk != "" ) { 
      return psk; 
    } else {
      psk = _psk; return psk;
    }
  }


  that.buildEncJSON = function(hash,keysize,method,salt,password) {

    if ( password ) {
      var psw = {};
      psw[selected_client.id] = password;
      var jsn = { "hash" : hash , "keysize" : keysize , "method" : method, "salt" : salt};
      jsn["password"] = psw;
    } else {
      var jsn = { "hash" : hash , "keysize" : keysize , "method" : method, "salt" : salt};
    }
    return jsn;
  }

  that.aes_encrypt = function(content,pass,salt) {

    var pre_key = Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(pass)) + Crypto.util.bytesToHex(Crypto.util.base64ToBytes(salt));
    console.log("preykey (HEX): " + pre_key);
    console.log("preykey (Bytes): " + Crypto.util.hexToBytes(pre_key));
    var keyhash = Crypto.SHA256( Crypto.util.hexToBytes(pre_key) , { asByte: true });
    console.log("Hash(SHA256): " + keyhash );
    console.log("initial vector length: " + iv.length);
    var crypted = Crypto.AES.encrypt(content, Crypto.util.hexToBytes(keyhash) , { mode: new Crypto.mode.CBC(Crypto.pad.pkcs7), iv : iv });
    console.log("encrypted data: " + crypted);

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
      } else {
        var name = reason + "=";
        var ca = document.cookie.split(';');
    	  for(var i=0;i < ca.length;i++) {
	    	  var c = ca[i];
		      while (c.charAt(0)==' ') c = c.substring(1,c.length);
		      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
 	      }
      } 
      
      return false;

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

  that.encPrivateKey = function (n, e, d, p, q, dmp1, dmq1, coeff) {
    var result,help = [];
    var INT = 2;
    var SEQ = 48;
    var lenbyte = 128;
    var all = n.length + e.length + d.length + p.length + q.length + dmp1.length + dmq1.length + coeff.length;
    
    if ( all.toString(16).length % 2 != 0 ) { var alls = "0".concat(all.toString(16)) } else { var alls = all.toString(16); }

    help = Crypto.util.hexToBytes(alls);
    
    var shiftlength = function(len) {
      var divid = (len / 256).toString();
      var result = divid.split(".");
      return result[0];
    }
    
    if (shiftlength(all) >= 1 || all >= 128) { lenbyte += parseInt(shiftlength(all)); help.unshift(lenbyte); } 

    help.unshift(SEQ); 
    
    if ( n.length >= 128 ) { n.unshift(INT,129,n.length); } else { n.unshift(INT,n.length); }
    if ( e.length >= 128 ) { n.unshift(INT,129,e.length); } else { n.unshift(INT,e.length); }
    if ( d.length >= 128 ) { d.unshift(INT,129,d.length); } else { d.unshift(INT,d.length); }
    if ( q.length >= 128 ) { q.unshift(INT,129,q.length); } else { q.unshift(INT,q.length); }
    if ( dmp1.length >= 128 ) { dmp1.unshift(INT,129,dmp1.length); } else { dmp1.unshift(INT,dmp1.length); }
    if ( dmq1.length >= 128 ) { dmq1.unshift(INT,129,dmq1.length); } else { dmq1.unshift(INT,dmq1.length); }
    if ( coeff.length >= 128 ) { coeff.unshift(INT,129,coeff.length); } else { coeff.unshift(INT,coeff.length); }
    
    result = help.concat(n);
    help = result.concat(e);
    result = help.concat(d);
    help = result.concat(p);
    result = help.concat(q);
    help = result.concat(dmp1);
    result = help.concat(dmq1);
    help = result.concat(coeff);

    result = help;

    return result;
  }

  that.decPublicKey = function (pubkey) {
    var length;
    var result = [];

    if ( pubkey[0] == 48 && pubkey[1] < 129 ) {
      pubkey.splice(0,3);
    } else if ( pubkey[0] == 48 && pubkey[1] >= 129 ) { 
      pubkey.splice(0,pubkey[1] - 125);
    }

    if ( pubkey[0] >= 129 ) {
      length = parseInt(pubkey.slice(1,pubkey[0]-127));
      pubkey.splice(0,pubkey[0]-127)
    } else {
      length = parseInt(pubkey[0]);
      pubkey.splice(0,1);
    }

    result[0] = pubkey.slice(0,length);
    pubkey.splice(0,length+1);

    if ( pubkey[0] >= 129 ) {
      length = parseInt(pubkey.slice(1,pubkey[0]-127));
      pubkey.splice(0,pubkey[0]-127)
    } else {
      length = parseInt(pubkey[0]);
      pubkey.splice(0,1);
    }

    result[1] = pubkey.slice(0,length);
    pubkey.splice(0,length);

    return result;
  }

  that.encPublicKey = function (n,e) {
    var result,help = new Array();
    var SEQ = 48;
    var INT = 02;
    var lenbyte = 128;

    if ( n.length >= 128 ) { 
      n.unshift(INT,129,n.length);
    } else {
      n.unshift(INT,n.length); 
    }
    var exp = [2,3,1,0,1];
    console.log(exp);

    var glen  = n.length + exp.length;

    var all = n.length + exp.length;
    if ( all.toString(16).length % 2 != 0 ) { console.log("yes"); var alls = "0".concat(all.toString(16)) } else { var alls = all.toString(16); }
    help = that.hexToBytes(alls);

    var shiftlength = function(len) {
      var divid = (len / 256).toString();
      var result = divid.split(".");
      return result[0];
    }

    if ( all > 256 ) {
      lenbyte += parseInt(shiftlength(all)); help.unshift(lenbyte); 
    } else if ( all >= 128 ) {
      lenbyte += 1; help.unshift(lenbyte); 
    }
    
    help.unshift(SEQ); 
    
    console.log(help);

    result = help.concat(n);

    help = Crypto.util.bytesToHex(result);
    result = help.concat(Crypto.util.bytesToHex(exp));
    console.log(result);
    for (var i = 0; i < e.length; i++)
    {
      e.pop();
    }
    
    return that.hexToBytes(result);

  }

  that.hexToBytes = function (hex) {
                for (var bytes = [], c = 0; c < hex.length; c += 2)
                        bytes.push(parseInt(hex.substr(c, 2), 16));
                return bytes;
  }
	
  return that;
}
