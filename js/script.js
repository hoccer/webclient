var fileCache, linccer, client, group, myname, payload;

var selected_clients = [];
var selected_name = "";

$(document).ready(function() {

	var LOCATION_ERROR = 'Could not locate you. Please set your location manually.';
	var TIMEOUT_ERROR = 'No transfer partner found';

	fileCache = FileCache( {'api_key': 'b3b03410159c012e7b5a00163e001ab0' });
	linccer = Linccer( {'api_key' : 'b3b03410159c012e7b5a00163e001ab0' });

	var map = HoccerMap('map_canvas');
	client = WebClient(map);
	client.setInactive();
	client.showHelp();
      
	var content;
	var groupid = "";

	myname = "<WebApp>";

	linccer.setName(myname);

	myname = myname.replace(/</g,"");
	myname = myname.replace(/>/g,"");

	var actname = document.getElementById('my_name');

	actname.innerHTML = '<strong>Webapp Name: </strong>' + myname; 

	linccer.peek(groupid);

	setInterval( "watch()" , 5000 );
	setInterval( "poke()" , 5000 );

	var myid = linccer.getID();
	var showImage = function(uri) {
		Shadowbox.open({
			content: uri,
			player : "img"
		});
	}
		
	var showDownload = function(uri) {
		window.location = uri;
	}
			
	var showText = function(text) {
		Shadowbox.open({
			content:
				"<div class=\"text-box\">" +
				"<p>" + text + "</p>" +
				"</div>",
			player : "html"
		});
	}

	$("#drag").click( function() {
		var uri = $("#drag").val();
		console.log(uri);
	});

	$("#change_name").click( function() {
		var inputname = document.getElementById('client_name');
		inputname.value = myname;
		$('#name_select').slideDown(500, function() {});
		$("#client_name").focus();
	});

	$("#close_name").click( function() {
		$('#name_select').slideUp(500, function() {});
	});

	$("#set_name").click( function() {
		var inputname = document.getElementById('client_name');

		myname =  inputname.value;

        linccer.setName(myname);

        myname = myname.replace(/</g,"");
        myname = myname.replace(/>/g,"");

        actname.innerHTML =  '<strong>Webapp Name: </strong>' + myname;

		$('#name_select').slideUp(500, function() {});

	});

	map.on('position_changed', function() {
		linccer.setEnvironmentCoordinates(map.latitude, map.longitude, 100);
	});
			
	map.on('address_changed', function(address) {
		$("#coordinates").text(address);
	})
		
	client.on('send', function() {
		client.connecting();
	});
			
	client.on('receive', function() {
		client.connecting();
	});
			
	client.on('file_selected', function(file) {
		content = fileCache.upload(file);
		client.setContent(content);	
		//client.sendmode();
	});

	client.on('file_canceled', function() {
		client.receivemode();
	});
			
	fileCache.on('started', function(url) {});
	fileCache.on('progress', function(progress) {});
	fileCache.on('uploaded', function(uri) {});

	linccer.on('ready', function() {
		client.displayLocation();
		$("#group").slideDown(500, function() {});
	});

	linccer.on('updated_environment', function(data) {
		map.setCenter(data.gps.latitude, data.gps.longitude);
	});
			
	linccer.on('sent', function(data) {
		client.showSuccess();
	});

	linccer.on('received', function(data) {
		client.showSuccess();

		var firstContent = data[0]['data'][0];
		if (firstContent.type == "text/plain") {
			showText(firstContent.content);
		} else if (firstContent.type == "image/jpeg") {
			showImage(firstContent.uri);
		} else if (firstContent.type == "text/uri-list") {
			showDownload(firstContent.content);
		} else {
			showDownload(firstContent.uri)
		}
	});

	linccer.on('peeked', function(data) {
		groupid = data.group_id;
		group = [];

		var a = 0;
		for( i = 0; i < data.group.length; i++) {
			if ( data.group[i].id != myid && data.group[i].name != "" ) {
				group[a] = new Object();
				group[a]["id"] =  data.group[i].id;
				group[a]["name"] = data.group[i].name;
				a += 1;
			}
		}

		var groupdiv = document.getElementById("group");
		var groupul = groupdiv.getElementsByTagName("ul")[0];
		var groupli = groupul.getElementsByTagName("li");

		for ( i = 0; i = groupli.length; i++) {
			var groupitem = groupdiv.getElementsByTagName("ul")[0].firstChild;
			groupdiv.getElementsByTagName("ul")[0].removeChild(groupitem);
		}

		for( i = 0; i < group.length; i++) {
			var item = document.createElement('li');
			var cname = group[i].name.replace(/</g,"");
			cname = cname.replace(/>/g,"");
			item.innerHTML = "<a href='#' name='" + group[i].id + "' onclick='return startApp(this);'>" + cname + "</a>";
			groupul.appendChild(item);
        }

		write_group();
		test_for_client();
		linccer.peek(groupid);
	});

	var test_for_client = function () {
		var isthere = false;
		var info = document.getElementById('info');

		for( i = 0; i < group.length; i++) {
			if ( group[i].id == selected_clients[0] ) { isthere = true; } else { isthere = false; }
		}

		if ( !isthere ) { 
			info.style.color = "#666"; 
			info.innerHTML = "<strong>Selected Client: </strong>" + selected_name + " (not connected)";
		} else {
			info.style.color = "#888";
			info.innerHTML = "<strong>Selected Client: </strong>" + selected_name;
		}
	}
        
	var write_group = function() {
		var groupdiv = document.getElementById("group");
		var groupul = groupdiv.getElementsByTagName("ul")[0];
		var groupli = groupul.getElementsByTagName("li");

		for ( i = 0; i = groupli.length; i++) {
			var groupitem = groupdiv.getElementsByTagName("ul")[0].firstChild;
			groupdiv.getElementsByTagName("ul")[0].removeChild(groupitem);
		}

		for( i = 0; i < group.length; i++) {
			var item = document.createElement('li');
			var cname = group[i].name.replace(/</g,"");
			cname = cname.replace(/>/g,"");
			item.innerHTML = "<a href='#' name='" + group[i].id + "' onclick='return startApp(this);'>" + cname + "</a>";
			groupul.appendChild(item);
		}
	}

	linccer.on('error', function(error) {
		if (error.code == 3) {
			$("#coordinates").text(LOCATION_ERROR);
			client.displayLocation();
		} else {
			//client.showError(error.message);
		}
	});
});

var write_info = function(_id) {
	infodiv = document.getElementById("info");
	cname = "";

	for( i = 0; i < group.length; i++) {
		if ( group[i].id == _id ) {
			selected_name = group[i].name;
		}
	}
	infodiv.innerHTML = "<strong>Selected Client: </strong>" + selected_name;
	infodiv.style.color = "#666";
}

var startApp = function (link) {
	selected_clients = [];
	selected_clients.push(link.name);
	linccer.setClients(selected_clients);
	write_info(link.name);
	$("#group").slideUp(500, function() {});
	$("#webclient").slideDown(500, function() {});
	client.setActive();
	client.receivemode();
}

var watch = function() {
	if (client.active() && client.mode() == "receiveMode") {
		client.showwaiting();
		linccer.receive( 'one-to-one', { 'waiting': 'true', 'timeout': 5000 } );
	}
}

var poke = function() {
	var payload = { 'client' : 'webclient', 'data': [ client.content() ] };
	if ( client.active() && client.mode() == "sendMode" ) {
		client.showwaiting();
		linccer.send("one-to-one", payload);
	}
}