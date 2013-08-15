/* Hoccer Wall Script by Peter Amende, Martin Delius and Robert Palmer */

var name = '';
$(document).ready(function() {
	var MAX_HEIGHT = $(document).height() - 200,
		MAX_WIDTH = $(document).width() - 300,
		MAX_ROTATION = 15,
		MAX_ELEMENTS = 6;
		id = 0;

	var LOCATION_ERROR = 'Could not locate you. Please set your location manually.',
		TIMEOUT_ERROR = 'No transfer partner found';

	var linccer = Linccer({
		'api_key'	: 'b3b03410159c012e7b5a00163e001ab0',
		'server'	: 'production'
	});
	var images = [],
		iframeDiv,
		map = HoccerMap('map_canvas', 'address_field'),
		group = new Array();

	var groupid = "";

	map.show();
	linccer.setEnvironmentCoordinates(52.51666009426117, 13.40919971466064, 500);
	name = $('#client_name').val();
	linccer.setName(name);
	linccer.peek(groupid);
	linccer.setpubkey('');

	var myid = linccer.getID();

	var audio = new Audio();
		audio.src = 'image-hitting-the-wall.wav';
      
	var scaleImage = function(img) {
		var factor = 1;
		if (img.width > img.height) {
			factor = MAX_WIDTH / img.width;
		} else {
			factor = MAX_HEIGHT / img.height;
		}

		img.width *= factor;
		img.height *= factor;

		factor = 1;
		if (img.width > MAX_WIDTH){
			factor = MAX_WIDTH / img.width;
		} else if (img.height > MAX_HEIGHT){
			factor = MAX_HEIGHT / img.height;
		}

		img.width *= factor;
		img.height *= factor;
	};

	var positionForElement = function(element) {
		var doc = $(window);
		var top = doc.height() / 2 - element.height() / 2;
		var left = doc.width() / 2 - element.width() / 2;
		return { 'top': top + 'px', 'left': left+'px' };
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * IMAGE */
	var addImage = function(uri, preview) {
		var	div			= $('<div></div>'),
			rotation	= Math.floor(Math.random() * 16) * ((Math.floor(Math.random() * 2) - 1) | 1),
			dropImage	= function(img) {

			setTimeout(function() {
				audio.play();
			}, 300);

			div.append(img)
				.attr('class', 'image')
				.css({
					'-webkit-transform'		: 'rotate(' + rotation + 'deg)',
					'-moz-transform'		: 'rotate(' + rotation + 'deg)',
					'transform'				: 'rotate(' + rotation + 'deg)',
					'height'				: '2000px',
					'width'					: '2000px',
					'opacity'				: '0',
					'overflow'				: 'hidden'
				})
				.appendTo('#wall');

			var position = positionForElement($(img));

			div.css({
					'-webkit-transition-property'	: 'opacity, top, left, width, height',
					'-moz-transition-property'		: 'opacity, top, left, width, height',
					'transition-property'			: 'opacity, top, left, width, height',
					'-webkit-transition-duration'	: '0.3s',
					'-moz-transition-duration'		: '0.3s',
					'transition-duration'			: '0.3s',
					'width'							: img.width,
					'height'						: img.height,
					'opacity'						: '1'
				}).css(position);

			$(img).css({
				'width'		: '100%',
				'height'	: '100%'
			});

			images.push(div);
			if (images.length > MAX_ELEMENTS) {
				$(images.shift()).remove();
			}
		}

/*
		if (preview !== undefined) {
			var previewImg = new Image();
			previewImg.src = preview[0].uri;
			previewImg.onload = function() {
				if (div === undefined) {
					scaleImage(previewImg);
					dropImage(previewImg);
				}
			};
		}
*/
		var	img			= new Image();
			img.src		= uri;
			img.onload	= function() {
			scaleImage(img);
			if (div === undefined) {
				dropImage(img);
			} else {
				var oldImage 		= $(div).children()[0],
					left     		= ($(oldImage).width() - img.width) / 2 + 10,
					fadeDuration	= '1s', transformDuration = '0.2s';

				$(img).css({
					'position'	: 'absolute',
					'left'		: left+'px',
					'top'		: '10px',
					'opacity'	: '0'
				});
				div.css({
					'-webkit-transition-property'	: 'left, width, height',
					'-moz-transition-property'		: 'left, width, height',
					'transition-property'			: 'left, width, height',
					'-webkit-transition-duration'	: transformDuration,
					'-moz--transition-duration'		: transformDuration,
					'transition-duration'			: transformDuration,
					'width'							: img.width,
					'height'						: img.height
				}).append(img);
				div.css(positionForElement($(img)));
				$(img).css({
						'-webkit-transition-property'	: 'opacity, left',
						'-moz-transition-property'		: 'opacity, left',
						'transition-property'			: 'opacity, left',
						'-webkit-transition-duration'	: fadeDuration +', ' + transformDuration,
						'-moz-transition-duration'		: fadeDuration +', ' + transformDuration,
						'transition-duration'			: fadeDuration +', ' + transformDuration,
						'opacity'						: '1',
						'left'							: '10px'
				});
				$(oldImage).css({
						'-webkit-transition-property'			: 'opacity',
						'-moz-transition-property'				: 'opacity',
						'transition-property'					: 'opacity',
						'-webkit-transition-duration'			: fadeDuration,
						'-moz-transition-duration'				: fadeDuration,
						'transition-duration'					: fadeDuration,
						'-webkit-transition-timing-function'	: 'ease-in',
						'-moz--transition-timing-function'		: 'ease-in',
						'transition-timing-function'			: 'ease-in',
						'opacity'								: '0'
				});
			};
		};
		return div;
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * TEXT */
	var showText = function(text) {
		var div;
		var rotation = Math.floor(Math.random() * 16) * ((Math.floor(Math.random() * 2) - 1) | 1);
		var lines = [];
		var txt = '';
		
		lines = text.split('\n');
		console.log(lines[0]);

		for( i = 0; i < lines.length; i++) {
			txt += lines[i] + '<br />';
		}
		div = $('<div></div>')
			.html("<span>" + txt + "</span>")
			.attr('class', 'text')
			.css({
				'-webkit-transform'		: 'rotate(' + rotation + 'deg)',
				'-moz-transform'		: 'rotate(' + rotation + 'deg)',
				'transform'				: 'rotate(' + rotation + 'deg)',
				'position'				: 'absolute',
				'height'				: '50%',
				'width'					: '50%',
				'margin'				: '0 auto',
				'opacity'				: '1',
				'overflow'				: 'hidden'
			})
			.appendTo('#wall');

		var position = positionForElement($(div));

		div.css(position);
		div.textfill({ maxFontPixels: 600 });
		return div;
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * VCARD */
	var showVcard = function(text) {
/*
		var div;
		var rotation = Math.floor(Math.random() * 16) * ((Math.floor(Math.random() * 2) - 1) | 1);
		var lines = [];
		var txt = '';
		console.log(txt);
		//txt = 'BEGIN:VCARD\nVERSION:3.0\nN:Thompson;Mattt;;;\nFN:Mattt Thompson\nitem1.EMAIL;type=INTERNET;type=pref:mail@matttthompson.com\nitem1.X-ABLabel:personal\nTEL;type=CELL;type=pref:412-527-7708\nitem2.ADR;type=HOME;type=pref:;;5000 Forbes Ave.;Pittsburgh;PA;15213;United States\nitem2.X-ABLabel:school\nitem2.X-ABADR:us\nitem3.URL;type=pref:http\://matttthompson.com\nitem3.X-ABLabel:_$!<HomePage>!$_\nBDAY;value=date:1987-03-17\nX-ABUID:ABD22CBA-0AA7-4A8A-BD2A-2AD566FC2BD2\:ABPerson\nEND:VCARD\n'

		txt = vCard.initialize(txt).to_html();

		div = $('<div></div>')
			.html(txt)
			.attr('class', 'text')
			//.css({ '-webkit-transform': 'rotate(' + rotation + 'deg)' })
			//.css({ '-moz-transform': 'rotate(' + rotation + 'deg)' })
			//.css({ 'position' : 'absolute' })
			.css({ 'height': '50%', 'width': '50%'})
			.css({ 'margin' : '0 auto' })
			.css({ 'opacity': '1', 'overflow': 'none' })
			.appendTo('#wall');

		var position = positionForElement($(div));

		div.css(position);
*/
		return div;
	};
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * YOUTUBE */
	var addYoutube = function(uri) {
		var iframe = $('<iframe title="YouTube video player" width="853" height="510" src="' + uri + '?rel=0&autoplay=1" frameborder="0"></iframe>');
		iframeDiv = $('<div></div>').append(iframe).attr('class', 'image').appendTo('#wall');

		var position = positionForElement(iframe);
		iframeDiv.css(position);
	};
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * VIDEO*/
	var addVideo = function(uri, preview) {
		var randomNumber = Math.floor(Math.random()*11);
		if (preview !== undefined) {
			var iframe = $('<video id="player_' + randomNumber + '" class="projekktor" poster="' + preview[0].uri + '" title="Video" width="640" height="360" controls><source src="' + uri + '" type="video/mp4" /></video>');
		} else {
			var iframe = $('<video id="player_' + randomNumber + '" class="projekktor" title="Video" width="640" height="360" controls><source src="' + uri + '" type="video/mp4" /></video>');
		}
		iframeDiv = $('<div></div>').append(iframe).attr('class', 'image').appendTo('#wall');

		var position = positionForElement(iframe);
		iframeDiv.css(position);
		var thePlayerId = '#player_' + randomNumber;
		console.log(thePlayerId);
		projekktor(thePlayerId, {
			volume: 0.8,
			playerFlashMP4: 'projekktor/jarisplayer.swf',
			playerFlashMP3: 'projekktor/jarisplayer.swf',
			autoplay: true,
			platforms: (['flash', 'ios'])
		});
	};
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * AUDIO */	
	var addAudio = function(uri, preview) {
		var randomNumber = Math.floor(Math.random()*4);
		if (preview !== undefined) {
			var iframe = $('<video id="player_' + randomNumber + '" class="projekktor" cover="' + preview[0].uri + '" title="Video" width="640" height="360" controls><source src="' + uri + '" type="video/mp4" /></video>');
		} else {
			var iframe = $('<video id="player_' + randomNumber + '" class="projekktor" title="Video" width="640" height="360" controls><source src="' + uri + '" type="video/mp4" /></video>');
		}
		iframeDiv = $('<div></div>').append(iframe).attr('class', 'image').appendTo('#wall');

		var position = positionForElement(iframe);
		iframeDiv.css(position);
		var thePlayerId = '#player_' + randomNumber;
		console.log(thePlayerId);
		projekktor(thePlayerId, {
			volume: 0.8,
			playerFlashMP4: 'projekktor/jarisplayer.swf',
			playerFlashMP3: 'projekktor/jarisplayer.swf',
			autoplay: true,
			platforms: (['flash', 'ios'])
		});
	};
	
	/* linccer configuration */
	var watch = function() {
		linccer.receive('one-to-many', {
			'waiting': 'true',
			'timeout': 15000
		});
	};
	linccer.on('ready', function() {
		watch();
	});


	/* Actions for received content */
	linccer.on('received', function(data) {
	
		//hide the manual after the first receiving
		$('#manual').hide();
		
		//show download button after min one file was received
		//$("#download_button").show();

		if (iframeDiv !== undefined) {
			$(iframeDiv).remove();
			iframeDiv = undefined;
		}
        
		var firstContent = data[0]['data'][0],
		preview = firstContent.preview;
		
		if (firstContent.type.match(/^text\/x-vcard/)) {
/* 			showVcard(firstContent.content); */
			showText(firstContent.content);
		} else if (firstContent.type.match(/^text\/*/) && (!(firstContent.content.match(/www\.youtube\.com/) || firstContent.content.match(/m\.youtube\.com/))) ) {
			showText(firstContent.content);
		} else if (firstContent.type.match(/^image\/*/)) {
			addImage(firstContent.uri, preview);
		} else if (firstContent.type === 'text/uri-list' && (firstContent.content.match(/www\.youtube\.com/)  || firstContent.content.match(/m\.youtube\.com/))) {
			var uri = firstContent.content.replace('m.youtube.com', 'www.youtube.com');
				uri = uri.replace('watch?v=', 'embed/');
			var uris= uri.split('&');
			addYoutube(uris[0]);
		} else if (firstContent.type === 'video/quicktime') {
			addVideo(firstContent.uri, preview);
		} else if (firstContent.type === 'audio/mp4') {
			addAudio(firstContent.uri, preview);
		}
		
		watch();
	});

	linccer.on('peeked', function(data) {
		groupid = data.group_id;
		group = [];
		a = 0;
      
		for( i = 0; i < data.group.length; i++) {
			if ( data.group[i].id != myid && data.group[i].name != '' ) {
				group[a] = new Object();
				group[a]['id'] =  data.group[i].id;
				group[a]['name'] = data.group[i].name;
				a += 1;
			}
		}

		//var check = document.getElementById("group_check");
		var link = document.getElementById('group_button');

		if ( group.length == 0 ) {
			selected_clients = [];
		}

		if ( selected_clients.length == 0 ) {
			link.innerHTML = group.length;
			//check.style.display="none";
		} else { 
			link.innerHTML = selected_clients.length;
			//check.style.display="block";
		}
		group_write();
		linccer.peek(groupid);
	});

	/* Linccer error handling */
	linccer.on('error', function(error) {
		if (error.code == 3 || error.code == 1) {
			if (error.code == 3) {
				console.log('Linccer Error Code 3')
			}
			if (error.code == 1) {
				console.log('Linccer Error Code 1')
			}
			//$('#settings').slideDown(1000, function() {});
			//map.show();
		} else if (error.message === 'request_timeout') {
			setTimeout(function() {
				watch();
			}, 100);
		}
	});


	linccer.on('updated_environment', function(data) {
		map.setCenter(data.gps.latitude, data.gps.longitude);
	});

	map.on('position_changed', function() {
		linccer.setEnvironmentCoordinates(map.latitude, map.longitude);
	});
	
	map.on('address_changed', function(address) {
		$('#address_field').val(address);
	});


	$("#info_button").click(function() {
		if ($("#group").is(':visible')) {
			group_write();
			$("#group").slideUp(1000, function() {});
		}
		if ( $("#settings").is(':hidden')) {
			$("#settings").slideDown(1000, function() {});
			google.maps.event.trigger(map, 'resize');
			map.show();
		} else {
			var bssids = $("#bssid_field").val().split(",");
			var cleanedIds = [];
			for (var i = 0; i < bssids.length; i++) {
				cleanedIds.push(bssids[i].trim());
			}
			linccer.setBssids( cleanedIds );

			name = $("#client_name").val();
			linccer.setName(name);

			$("#settings").slideUp(1000, function() {});
		}
		return false;
	});

	$("#group_button").click(function() {
		if ($("#settings").is(':visible')) {
			var bssids = $("#bssid_field").val().split(",");
			var cleanedIds = [];
			for (var i = 0; i < bssids.length; i++) {
				cleanedIds.push(bssids[i].trim());
			}
			linccer.setBssids( cleanedIds );

			name = $("#client_name").val();
			linccer.setName(name);

			$("#settings").slideUp(1000, function() {});
		}
		if ( $("#group").is(':hidden')) {
			group_write();
			$("#group").slideDown(1000, function() {});
		}
		else {
			$("#group").slideUp(1000, function() {});
			linccer.setClients(selected_clients);
			group_write();
		}
		return false;
	});


	var group_write = function () {
		var groupdiv = document.getElementById("group");
		var groupul = groupdiv.getElementsByTagName("ul")[0];
		var groupli = groupul.getElementsByTagName("li");

		for ( i = 0; i = groupli.length; i++) {
			var groupitem = document.getElementsByTagName("ul")[0].firstChild;
			document.getElementsByTagName("ul")[0].removeChild(groupitem);
		}

		for( i = 0; i < group.length; i++) {
			var item = document.createElement('li');
				item.setAttribute('class','client_item');
				item.setAttribute('id','client_item_'+ i);
			var inner = document.createElement('span');
				inner.setAttribute('class','client_item_inner');
			var box = document.createElement('input');
				box.setAttribute('type','checkbox');
				box.setAttribute('value', group[i].id);
				box.setAttribute('class', 'group_box');
				box.setAttribute('id', 'group_box_' + i);
				box.setAttribute('name', 'group_box_' + i);

			if(selected_clients.indexOf(group[i].id) != -1) {
				box.checked = true;
				item.setAttribute('class','client_item active');
			}

			var	cname = group[i].name.replace(/</g,"");
				cname = cname.replace(/>/g,"");

			inner.innerHTML = cname;

			groupul.appendChild(item);
			item.appendChild(inner);
			item.appendChild(box);
		}
		
		$('.client_item').click(function() {
		    var checkBox = $('.group_box', this);
			if(checkBox.is(':checked')) {
				$(this).removeClass('active');
				checkBox.attr('checked', false);
			} else {
				$(this).addClass('active');
				checkBox.attr('checked', true);
			}
			var trusted = checkBox.get(0);
			trustsender(trusted);
		});
	};
	
	
	
	$("#done_settings").click(function() {
		var bssids = $("#bssid_field").val().split(",");
		var cleanedIds = [];
		for (var i = 0; i < bssids.length; i++) {
			cleanedIds.push(bssids[i].trim());
		}
		linccer.setBssids(cleanedIds);
		name = $("#client_name").val();
		linccer.setName(name);

		$("#settings").slideUp(1000, function() {})
		return false;
	});
      
	$("#done_group").click(function() {
		$("#group").slideUp(1000, function() {});
		linccer.setClients(selected_clients);
		group_write();
		return false;
	});
      
	$("#legal_notice").click(function() {
		if($("#legal").is(':visible')) {
			$("#legal").slideUp(500, function() {});
		} else {
			$("#legal").slideDown(500, function() {});
		}
		return false;
	});

	$("#show_hotspots").click( function() {
		if($("#bssid").is(':visible')) {
			$("#bssid").slideUp(500, function() {});
		} else {
			$("#bssid").slideDown(500, function() {});
		}
		return false;
	});
	
});

var selected_clients = [];
var trustsender = function (box) {
	if (box.checked) {
		selected_clients.push(box.value);
		console.log(selected_clients.push(box.value));
	} else {
		var idx = selected_clients.indexOf(box.value);
		selected_clients.splice(idx,1);
		console.log(selected_clients.splice(idx,1));
	}
}