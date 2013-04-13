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

	var linccer = Linccer( {'api_key' : 'b3b03410159c012e7b5a00163e001ab0', 'server' : 'production' });
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
		var div,
		rotation = Math.floor(Math.random() * 16) * ((Math.floor(Math.random() * 2) - 1) | 1),
		dropImage = function( img ) {
			setTimeout(function() {
				audio.play();
			}, 300);          
			div = $('<div></div>')
				.append(img)
				.attr('class', 'image')
				.css({ '-webkit-transform': 'rotate(' + rotation + 'deg)' })
				.css({ '-moz-transform': 'rotate(' + rotation + 'deg)' })
				.css({ 'height': '2000px', 'width': '2000px'})
				.css({ 'opacity': '0', 'overflow': 'none' })
				.appendTo('#wall');

			var position = positionForElement($(img));

			div
				.css({ '-webkit-transition-property': 'opacity, top, left, width, height' })
				.css({ '-webkit-transition-duration': '0.3s' })
				.css({ '-moz-transition-property': 'opacity, top, left, width, height' })
				.css({ '-moz-transition-duration': '0.3s' })
				.css({ 'width': img.width, 'height': img.height})
				.css({ 'opacity': '1'})
				.css(position);

			$(img).css({ 'width': '100%', 'height': '100%'});
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
		var img = new Image();
		img.src = uri;
		img.onload = function() {
			scaleImage(img);
			if (div === undefined) {
				dropImage(img);
			} else {
				var oldImage = $(div).children()[0],
				left     = ($(oldImage).width() - img.width) / 2 + 10,
				fadeDuration = '1s', transformDuration = '0.2s';
                
				$(img).css({'position': 'absolute', 'left': left+'px', 'top': '10px', 'opacity': '0'});
				div.css({ '-webkit-transition-property': 'left, width, height' })
					.css({ '-webkit-transition-duration': transformDuration })
					.css({ '-moz-transition-property': 'left, width, height' })
					.css({ '-moz-transition-duration': transformDuration })
					.css({ 'width': img.width, 'height': img.height})
					.append(img);
				div.css(positionForElement($(img)));
				$(img)
					.css({ '-webkit-transition-property': 'opacity, left' })
					.css({ '-webkit-transition-duration': fadeDuration +', ' + transformDuration })
					.css({ '-moz-transition-property': 'opacity, left' })
					.css({ '-moz-transition-duration': fadeDuration +', ' + transformDuration })
					.css({ 'opacity': '1', 'left': '10px'} );
				$(oldImage)
					.css({ '-webkit-transition-property': 'opacity' })
					.css({ '-webkit-transition-duration': fadeDuration })
					.css({ '-webkit-transition-timing-function': 'ease-in' })
					.css({ '-moz-transition-property': 'opacity' })
					.css({ '-moz-transition-duration': fadeDuration })
					.css({ '-moz-transition-timing-function': 'ease-in' })
					.css('opacity', '0');
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
			.css({ '-webkit-transform': 'rotate(' + rotation + 'deg)' })
			.css({ '-moz-transform': 'rotate(' + rotation + 'deg)' })
			.css({ 'position' : 'absolute' })
			.css({ 'height': '50%', 'width': '50%'})
			.css({ 'margin' : '0 auto' })
			.css({ 'opacity': '1', 'overflow': 'none' })
			.appendTo('#wall');

		var position = positionForElement($(div));

		div.css(position);
		div.textfill({ maxFontPixels: 600 });
		return div;
	};

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * VCARD */
	var showVcard = function(text) {
		var div;
		var rotation = Math.floor(Math.random() * 16) * ((Math.floor(Math.random() * 2) - 1) | 1);
		var lines = [];
		var txt = '';
		console.log(txt);
		//txt = 'BEGIN:VCARD\nVERSION:3.0\nN:Thompson;Mattt;;;\nFN:Mattt Thompson\nitem1.EMAIL;type=INTERNET;type=pref:mail@matttthompson.com\nitem1.X-ABLabel:personal\nTEL;type=CELL;type=pref:412-527-7708\nitem2.ADR;type=HOME;type=pref:;;5000 Forbes Ave.;Pittsburgh;PA;15213;United States\nitem2.X-ABLabel:school\nitem2.X-ABADR:us\nitem3.URL;type=pref:http\://matttthompson.com\nitem3.X-ABLabel:_$!<HomePage>!$_\nBDAY;value=date:1987-03-17\nPHOTO;BASE64:/9j/4AAQSkZJRgABAQAAAQABAAD/4g84SUNDX1BST0ZJTEUAAQEAAA8oYXBwbAIAAABtbnRyUkdCIFhZWiAH2AAFABUADAAWABZhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwQIfmzI+7NpReRxO3K7aqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1yWFlaAAABIAAAABRnWFlaAAABNAAAABRiWFlaAAABSAAAABR3dHB0AAABXAAAABRjaGFkAAABcAAAACxyVFJDAAABnAAAAA5nVFJDAAABrAAAAA5iVFJDAAABvAAAAA52Y2d0AAABzAAABhJuZGluAAAH4AAABj5kZXNjAAAOIAAAAJ9jcHJ0AAAOwAAAAEBtbW9kAAAPAAAAAChYWVogAAAAAAAAZPcAADoEAAAG2lhZWiAAAAAAAABqIQAArbQAABwhWFlaIAAAAAAAACe+AAAYYgAAsCpYWVogAAAAAAAA81IAAQAAAAEWz3NmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBsY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAdmNndAAAAAAAAAAAAAMBAAACAAABJQHEAkwC2QNmBAcEkAUsBdAGdAcgB8gIcgkiCdUKiQs9C+4Mqw1pDiYO4Q+fEGERJhHlEqoTcRQ4FPsVwhaLF1YYIxjxGb4aixtZHCYc+B3JHp0fdCBLISAh9SLPI6gkhSVkJkQnJCgFKOkpzSqzK6Asjy16LmsvYjBYMVIySDNNNFg1XzZuN4E4ljmyOtE79z0hPk0/gkC6QfpDN0R4RcRHEkhhSa5K/ExQTaJO81BJUZ1S8VRCVYhW01geWWhasVv3XUBei1/PYRBiUmOSZNRmE2dPaIhpwWr9bDNtam6hb9xxFnJJc3t0snXqdyJ4W3mQesZ8A31Afnl/oYC1gcSC2IPqhPqGDYcjiDuJU4poi32MmY24jtOP7ZEGkiOTPpRWlW+WiZelmLyZ0prmm/6dFZ4nnzigSaFaomajb6SEpZ+mtKfOqOep/6sXrDCtTK5kr3qwkbGqssOz2rTutgW3H7g1uUy6Z7uFvKC9tr7Rv/DBDcIsw0jEaMWNxq/Hxci8yafKlsuDzG7NW85LzzvQK9EY0gnS/tPw1ODVz9bE17HYn9mO2n7ba9xW3UHeLN8X3/7g5eHK4q/jj+Rx5VrmROcs6Bfo/+nn6s/ruuyg7YbubO9T8DnxHfH/8uXzyPSq9Y/2dvdb+D35IPoH+u771Py4/aH+iP9R//8AAAEZAYECHQKWAyYDqgQ4BMUFWAX0BocHIwe/CGAJBgmkCkoK9gucDEYM8g2eDk0O/g+uEF8RERHEEnkTMRPoFKIVXhYcFtgXlxhZGR4Z6RqxG30cUB0hHfse1h+yIIohXCIvIv4j1iSxJY0maidMKCgpCynxKt0rxyyzLaUumC+MMIIxejJ5M3k0ezWFNpA3mzimObo60jvtPQw+Jj9OQHhBokLSRARFN0ZwR61I6kolS25Mt03+T0dQhlHNUxRUWVWfVuBYKFlxWrRb9l06XntfwGEDYkRjg2TDZghnSGiIactrEmxZbZtu2nAhcWlysHP7dUF2iHfYeSl6dHunfL59zX7hf/OBAoIVgyuEQoVbhnCHhYigib+K2ov0jQ2OKo9EkFyRdZKQk6uUwZXYluyYBJkamiybPZxOnV6ea590oImhpaK8o9ek8qYMpyaoQqlhqnyrlqyyrc+u7rAKsSayRLNltIS1pbbJt/G5Fro5u2G8i722vuPADcE7wm/DoMTExcXGtsetyKDJksqIy3/Mec1wzmbPYNBd0VnSUtNL1EXVPtY11y3YJdkc2hHbAtv23Ord2N7H37Pgn+GG4nDjauRs5WzmbOds6Gvpaupr62fsYu1d7ljvUvBI8T3yM/Mo9Br1DvYE9vf35fjV+cb6ufup/Jf9if56/0z//wAAARkBgQIZAoMDDQOHBBYEowU5BcwGZAcEB6AIRAjqCYgKLArXC4EMLQzZDYQOMQ7eD4wQPBDnEZgSSxL7E6kUVxUDFbQWZRcUF8AYbRkcGcYacxshG8wceB0jHdEefB8nH9UggCEpIdgihyM4I+4kpiVgJh0m2SeaKF8pJynuKrkrhyxXLSkt+i7QL6owhDFfMjszGDPzNNI1sjaRN284TzktOgw67zvMPKc9hj5lP0BAF0DtQdJCvEOkRI9FfEZmR1RIPkktSh5LDEv6TOhN2E7KT7xQrVGeUpFTiFR8VXFWaldmWGRZXFpVW1RcVF1VXlhfWGBZYWNibGNwZG9lYGZUZ01oQ2k2ai9rKmwnbSRuIG8dcCBxJXIocyt0LXUzdjd3Ong+eUV6S3tQfFJ9VH5af1+AXYFeglyDXIRYhVCGWIdqiHiJi4qci66MvI3NjuGP8JD+kg2THZQtlTuWR5dWmGaZdJqDm5Wcq529nsuf3qD1ogyjI6Q4pVGmb6eLqJ6poaqdq56sna2Yrpmvm7CfsaOyorOotLO1vLbCt8i407nauuG76rz0vf2/BcALwRPCHcMjxCfFLMYwxzHIN8lqysbMHc1vzsTQHNF30s/UNtWa1wjYg9oF24/dJ97I4H3iROQk5gvoBuol7E7ukfDv82n18fin+17+Jf//AABuZGluAAAAAAAABjYAAJh1AABY4QAAUqUAAI/9AAAoDAAAFqgAAFANAABUOQABwo8AAauFAAFCjwADAQAAAgAAAAAAAgAIABEAHgAtAD8AVABsAIYAowDEAOUBCgEyAVwBiAG4AekCHQJVAo4CygMIA0gDiwPRBBoEZASxBP8FTwWjBfkGUAaqBwQHYQfACCEIgwjoCU0JsQoaCoQK7AtXC8IMMgydDQcNdQ3iDk8OvQ8rD5gQBxBzEOERUBG9EisSmBMFE3UT5RRTFMEVMBWgFhIWhRb5F2wX4BhZGM8ZRxnAGjwaths2G7ocPhzCHUgd0B5YHuUfch//IIwhHiGzIkki4SN7JBQksSVQJfImlyc+J+MojCk5KeYqlStEK/Mspi1eLhgu0C+JMEUxADG9Mn8zQjQDNMI1hTZMNx44AjjuOdc6wjuzPKU9lD6FP3dAakFjQl1DU0RIRUJGP0dASEBJQEpHS1BMWk1lTnBPg1CXUbFSyVPhVQFWJ1dNWHdZolrXXA9dOl5jX5RgwmHzYydkXmWXZs1oBmlHaolrzW0QblZvoHDvckFzi3TfdjR3iXjcei17h3zofkR/nYD7glaDuYUfhn6H2ok/irWMXI4cj9WRmZNilSOW6piumn6cTZ4Tn+GhtqORpWSnSKkuqxSs+67usOey5LTetui49bsMvSO/TsFvw3/FoMe6yd7MB84w0FjSkNTI1wbZQ9uL3dzgJuJ85NXnKul96+PuSvCp8wv1c/fk+kb8vP//AAAAAAADAAoAFQAkADYATABlAIEAoQDDAOkBEgE+AW0BnwHVAg0CSAKGAsYDCQNPA5cD4QQrBHoExwUYBWgFugYOBmkGxwcpB4kH6whQCLQJHgmHCfEKWgrICzULogwSDIMM9g1nDdoOTw7BDzUPqhAjEJoREBGHEf4SdhLyE2kT4RRbFNYVThXKFkYWwRc9F7gYNxi3GTMZrhoxGq8bMRu4HD4cwx1LHdUeXx7uH3wgCSCYISohwCJVIuwjhiQeJLklViX2JpcnOyfbKIApJynPKngrICvILHMtIS3ULoQvMy/kMJcxSDH9MrYzbjQkNNg1kDZNNxY39jjiOcs6tjunPJo9iT56P2xAX0FXQlFDSEQ9RTdGNEc0SDZJNUo9S0ZMUE1aTmZPeVCMUaZSv1PXVPdWHVdCWG1ZmFrMXAVdMF5XX4dgtGHiYxRkSGV+ZrFn5mkjamFrn2zebhxvX3Clce5zMnR5dcR3DnhWeZx65Xw2fYZ+0oAfgWyCuYQNhWGGrof6iU2KsoxJjf2PqJFekxmUzJaDmDeZ9Zu2nW6fKKDoorCkd6ZAqBOp56u8rZWvdrFis0u1NrcxuS67NL09v1jBZMNBxTHHGskMyv3M+M7u0OnS9NT81wvZGts03Vffe+Gi49PmBOg06mvstO738T3zgfXS+Cn6cvzU//8AAAAAAAMACwAXACYAOQBPAGgAhAClAMcA7QEWAUMBcwGmAd4CFwJVApcC3gMmA3QDxgQcBHcE1QU4BaAGCgZ7Bu0HaAfiCGAI3gldCd4KYgrlC2kL8Ax3DP8NiQ4WDqIPLw+/EFEQ5RF9EhQSrhNNE+0UkRU3FdwWjBc8F+wYpBliGiQa1RuOHEgdAR3AHn4fQiAEIMchkCJbIygj9STDJZYmaydDKBYo8SnMKqcrgSxcLT4uIi8DL+UwyTGtMpczgTRmNU42PDcxODc5PTpAO0k8Vz1hPms/dkCDQZVCp0OzRMJF1UbrSARJGEo1S1RMc02STrRP21EGUjRTX1SPVclXAVhBWX9ax1wVXUxefl+4YO5iKWNkZKZl6GcmaGxpumsEbFRtoW70cEtxpnL/dFl1uXcZeHd50ns0fJ9+Bn9ogNCCNIOfhQ6GdofbiUeKwYxWjfePkZEzkt2Uf5Yil8WZa5sbnMGeY6ALobmjaqUUpsiogKo2q+ytpa9ksSmy7rSttnm4S7oeu/K9zr+3wXnC6MROxbzHMMiqyh7Lk80GznnP89FZ0s7UONWf1wDYWdmw2wTcVd2e3t7gJOFc4o3ju+TY5fXnFOgr6UDqTutS7E/tTe5K7z/wMvEg8gry7/PR9K71jPZp90L4EPje+az6evtJ/Bf83f2d/sP//wAAZGVzYwAAAAAAAAAXQ29sb3IgTENEIENhbGlicmF0ZWQgMgAAAAAAAAAAFwBDAG8AbABvAHIAIABMAEMARAAgAEMAYQBsAGkAYgByAGEAdABlAGQAIAAyAAAAABdDb2xvciBMQ0QgQ2FsaWJyYXRlZCAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtbW9kAAAAAAAABhAAAJxgAAAAAL/4e4AAAAAAAAAAAAAAAAAAAAAA/+EAQEV4aWYAAE1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAALqgAwAEAAAAAQAAALoAAAAA/9sAQwACAQECAQECAgECAgICAgMFAwMDAwMGBAQDBQcGBwcHBgYGBwgLCQcICggGBgkNCQoLCwwMDAcJDQ4NDA4LDAwL/9sAQwECAgIDAgMFAwMFCwgGCAsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsL/8AAEQgAugC6AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/JQa8SMnjjGPSmHXkZdrOcA9fWuLOu7x8u4juc1FJruVwh5Br5F4aTPfeLO/TXUMZJPPSmW+o/a5EjlYRljtBz1rhU8QMgGDnJzXqn7Pfwe1D4t66l1PG8OjWf7y4uChwpX5iCe3yjNKpS9nHVgsRzux6L8G/wBmXUvHHi+3sNbgmFtPJCgEOGe5ZgDtU5xkA8+nfFe3eNfjf4U/Zz1ifRNOvl0u20O3+zpFGVlnllC4MjSDgZI6DPtXjPxG/adu/wC3NI0T9neGZ5bMs32hHKsZXBXzC38KqAPrmvPviP4H8P8AgW9XWvjj4lPiTV7zE0+j6I4k+zZwSs85yAx5GELYNclKnDmvU17JdQrKc42i9D2PwH/wVE1Tw54a1vSdCs4mudYMiNfXP7yRQyhRtHU9Gb34XgFt3GaUPjf8V/J03RNE157bXXXyAYmWLaThD82ODkDceOW9SG5j4k/ttaRot3aL+yp4H8PeBbCyxiaRPtupXBGPnknlU4c7QflwMseleX+Nv2m/FfxC1CW78UeKfEdzPI2VeS+kIBLBxkZwAG3HgY9K7qGFlK9RQUW+j3OROUIqN9j6c8X/ALPnxX+HuiJpPxe8W+HtEivo2TyLzxDEzwIrkeWYYnY4DkuQep46YI5TxL+yTJoAsor74yeBbttR25hS+kl8oZziQ7cZGfWvk/U/GdxJOr3srXLp8qu7l3x6ZYnA71DB4ycYWeQsFPBBI/XPNarLcVJXhUt8l+posTQjZNH19qX7C6eDPD66pa/GTwFfWswEclul46zAvg7cEYzg/MRkYXAOeK8vl/ZW1m9H9o6Z4w8H3MLKZQrasFYIp5ZgOmScADn1FeLN4iM8TKXJTPXOSp9R/Knx+ItsIt74s8JOMb/vY7Y4xXXhsLiaDvOfN8l/kZV5Qq/C7Hufwp/4J+fFb4kz3F/8OLKHULHT5lhlvI9QiCo2MqQS43bechc9a5f4m/s/eO/AnicQ6ro+tSSKxjxCrSZxwQCoOeBj8K4bRviHqfhCVToeoXNuASQ8UhBBPcDPH1GK6Xwh+1N4x8Lat9pttc1N1Y4TzbgymIEdRuPU96HDFuq5Jrk6d/wJUKThyzfvGTbeL9T8BeI1mnW6hvLeQP8AvAQ6kEcfnkn/AHcV2mq/tWeJb2QT6Vql2pgiwjK+GjXIJUH1baCfrTZ/2sNcmI/4SKz0TVYWHlv59mu51JyQWHOfeuw8ZfF/4KfEPwwv9p/Dq78MaqtukKS6TqJkt5GCgF5I3xhieSBkVz4hqcl7SnfzLoxdGL5GcQP2gda1vUU1O/1CaW9DBi0jEgYO7hTwMk49a9Ttf2vv7Jsor6Exy6isMMW8qADs3Fs+pO4jJ/vV4dd/By219C3wr12K8Vk3tbXHyup/u5PcdK5eTTbrwlJNZeK7doJFHyhgcE9sHpWrwtNpcmnkYe2m78x9P2X7aOrXN6La+IudI1GQC4sww2sM8Hd0X1wK9P0f9pXT/hrdhbp0uLe/Td8zZQ5ORGB1wOma+DtG8TG0VlVXKnooxgV2eieJ01TwvMNSJea2IMRcglB6D6VyYnLqcmmo29DehiZQTTPvnSfjRpPiG0udfsbdIo4wPPtwoJi3D+EDkjnv0p2s6F4b+Nnw1A1Cwgt3jbyBIjZKtjjJ/rXw54S+Md3pl/CumSSLDPmG5BOPNzwPbAr074VftIXHw2nudM1TNzp/nBZmPKsCfvDvxXHVy+TTnHdGlOqtIPY4X9of9n3XfgvrBkvEE+mXILwzpyEXqAT0zgivJGncsdxkJ7naea+6vHfxL0rxjFo1lrKQ6po9zA32iHPEIbhW/AYrwXUf2Y7d9QnOmtC1uZGMRLtkpnjP4YrowuIfLaa1CvRUXeOx4k0w8vOScdqilmZVDAADsKjOoIGYE4AHp3qvJf7TkYJHBGelevGk3sczkrG54Z8P3Pi7VrWy04CWe4lCBMHKk/T619SzQ6n8N/BUfwr8Ew2/9qyQS3Gr3CtxFL1kdmzgKibVOTj5W9Rnzj/gnv4d+2/F+TWNYhB0vSbOW7kkYcBk5Xn3LAVL+1B45n0KS7t/Dd7J/aGvSNe6mYziVUZyVh3jsQQzDu2QeBXnVmqmI9ktUjeMPcUu5laz8d9O+Gfw6ufBvw40+2ie6cjU9YeH/SL4jjCtnMa5HAFeNXPiO6d2ZnaRW5JZydwPtj+tRy3SX6iPVGPmgdAcDPqSaz7wTozeUwIUY3DoR7V61HDxi7pamM6koq0WLeX8crZQEyn8Bj1qqhkmlGNzjcBjPGMVNo+lXGtXaxWiZz944+6Peu78NeDraxUIsRuZO7AcKfrVVMRTw0bS1Hh8JVxL1ZxEfhyW8jGyNmI44Hermm/D2+umAFtJwf4hxXrmm6BILcbEgt0JwDgEmt7R/B1zcc208R4z81eXPNmnZKyPXhk0ZrU8o0z4Zypy1u4ZM4G3hj3qhrnwvuRJHKhAB4wAeCa99tPBt8EUyMpDZxjgGq934SnwFKfKcNuA71yRzOpzXTO7+xIygonzpqPw91HS1C3URZSeop0PhKaRAuHHH5V9DyeHJbmJhdRhlRum3JNQweE7VzloFIPTjGK6HmztqkYrhyN73PAl0K+tYBEwOzknI/Kqi2dzDa7ZEOM5IPevoi68M2k8ZBhUoBwoHSsLU/AdtdxlRGAcZ6U6eb9JGNbI2vhkeTaBrL2yGIExmMko2SSP5Vbl8Wz6+1va+K5Xu7eJ+CwAZOMcH0FdD4h+GQhVmszjj6VwmpabP4fumMwGAch+uPwruo1addtxep5GJwk6KSewzXtMm0CcvbM0ltKx2MBzz0B96k0DU/JspTJJId4HHrU0GupqNobXUpMxBt/Tndj/ABrJltnt4gOiqeDkHIrsUPaQ5ZHFdLY24NaaO3XKsqiQYGOTXTv4khsJhJcBm82PdtJyCff6VwhupWjSLzFCsVKn+VaVze/6ZEkrtJJHGVGMEVlUo80lYtSO78K/EqbQ7u0vbmRiHR4Xj52sCflH4V16fEeYoNt5KBjgDOB9K8fa783Sy1yceXL8vHvWkniWaJAqS2wCjABPI+tcMsK5t8qNY1bK0mcu7vM4EhABOCRTTCzSYBLEd+OKspbBSwPQcn2NSx2/lRkvtr0ueMdepg4OT0PcP2XfE7eEfhr4sluoZNl2kUD3S5ykab5GTHTnaOfavIvGOu3XiDWL3UbycyfbpGfceN2STxjpXoPwI1tW8P6xpd8S1ncoryJk4Y7SP0DV5brUFxp19LHMFEcbfKnoc15mHpJ1ZSW56rlyUUjPmHnkeYGRMcKev1zVXMhlCK52k4FXLq+ieT/SwxfHOO1VtKTztejSHJDMDzyK9dpxi2efFOUku53HgrRFtrRVIYeactt+/I3pnsBXpvg7wHc6vtMzLErDISL19z61yOl3dtorNNqTpGgwPlBOcdsD1rdsfiNq+rXKf2CPsVpGQFAUbmHrXzdeFSrJtM+joVqWHShJansfg/4Cpe2ga7SXexBTcOG9a9K8N/s3x/IzW7Bug7Cui/YR0i7+Ilm3/CRSG5gt3UBpBz9BX3PZ/BvRVs4ttuoIUFVK8k4618ljq1SM3C+x9xl1CnVpqaR8NQfsyTzqEaF9nQYHTJxWrYfsf+fbx+cjeSTgAjqfrX23rngez0Tw7cTyQKjRxgBgvUjnFfEvxq/bZ1H4datcaPoWmWpit5WbdKxLEhjzkcCsKHtazsjrxLoYaN5l+7/Y2gsbZiI2AcE5IrzXxh+zG+mzeZYvG0bcKuOTTtO/4Kn30jra6lo0EkW8rJljuPriuog/bq8H6t5X2mzMDbcFT2P5V2fVMVR96zOCGY4Oad2keU3n7O9zCWaKMjFY+q/BG8t7fdL8nGRx1r3C3/ac8Oa7cf6GsXlkgAbhk+vFdWI9H8caPLNoDo8ijJj7ofTFc1SrXpaziy6ccNiPhaZ8W+J/AFzaRkSxNjOc+teZeO/DDHcJYmygJUBRzmvuXUfASajIyTxhucbdvIrzb4tfBu2sLeWaaIgY/hHSu7AZnyzSb1PKzLKW6blFaHwpceC74TStbQtu6g8cgVWt74qVgvI9o34ZWU5FeueL0TQ9VlisyRGpLAkjrnmuX1nw3a+MrM3EapHcoScqcCQ98ivu6OLVWKufnNbDypysjn9X8NpYJBcWEvmQShWGBwnOSPwqC9ja2uopFKnzEBGB14pl1dy6LKIZf3UIwxX7w5rphb22paF5ljh5IsEZ6/gK1cuT3iLJ6GFbTE2zyagchD8i+5pp8L3Dnc8SsTyTvHP61b1u1FtYJNJGSH+YAEYznr+dUEvrkoMNu46561VOWnMuo+Tl3LInChdxGT19qjN6fKO/1pEgJ5l9cH61YMOYSBs4IHNZScTSKbNnwL4pOg6kfNZ/KnUI4A/L8qXx7p4OpszNtmZQRK33ZM9x9azYLUQSKxwTyT+Na2oxLr+iIjMWubRQqlukgx61z8yjNNdTog24uLOQuraW1eQzKkrqDlwRtAAz1/T68da0PBfg3VdX1FH0XTL64Y5/1ULPjHXoK7r4EeELLStRvdd8aWmmaxbabZyzWmly3mRLOCEVp44zuEatJvxuUNs6HNXR8cPFlyqRQ6rNp9s7BVgslFpAgLdkh2Ar6A9q3qYhq8Yip4e7TkyCy+BnjHV76B20XU4oN+XMts4A/MV6VYfs9XttbJPJcGG4wG2MCAPw7Cvf9E1C1+F/wp0u4uZ7jVdav4o33M7MQXAwAhJzyaf4T8C618T2kfxL4y8M6AWJ/wBClmjkulwTwy5wDxyueK+UnjalaTS2R9xhsopUoRlU1b7ifsd+O9R+E2pNZXpjkSaVdxLDb+A9a/Sn4V33/CU+H4Lq3jll80bg5+6vrzX5x6v8GdS8NuHuJrPVQMFbi3Hlsp6ggDj8K+t/+CcF98YPi38MNYsvAdz4N03S9Iv2shqGp2s11fSMoBKiNSqjAKnk14mKouvJyT9T6OhNYWmopb7Hsn7SovvDnw7e6igcrGpDEDggjGc/Wvxz/aIOpeNPHt8dFiZxvKuy5IkG49+1fqZ+258PPjj8NfgjqOreKviF4V1HT7RWNxb2vh0xTbMZO12mbGCT2r87PEETR6FHqfh1muYZx+9lCkszdycDrn0rXBUpUW5wd0cWZWxDVOSszwsfCq4tJJJLl0WTjaDnj1qz/wAKwmuJIpbS9iaRGO5SOPxJ6fjWp441m+uCz6pdXFrYREBioO52P8K4bmvoX9jT9i+/+M+jHXvDukWOqQRj99Be6lJBMuBn5guRn0r2/aVXDmufOzo0Iy9nJHing/4Baz4yDyWjQLjA+UFWf0wR0roF+H/xF+Eeribw49xcRqwEiMeCT796918eeGLb4c6m9s9peeDdRj5iimmNxbXeOwPXJ98VBofxD1DVWtFtPK+1C5VJ0lYLEBxk5JwOvc15k8VNtqSv6nq0cDShFSg7ehofADW9X8bWjyeMLE2NwnysGXBc9zXY/Ej4ZRa34MvhEA0mwsDj0BoT4peHNP1Q6XNr2ix3sbbZVF1GzenBU4r0nw5aW+uaQ66bc211FMNg2OH+Xn09q+fxPtIVFUcWkfQQnTnh3TU02fj98TIZE8T6hbAhmtmI985Ncgt89rl1faEyStfRP7YnwZuPhd8YNYSaIeVen7TE3ABUk55rwTxXpKbS+VVjlseor9Cy6tCpTij8szOhOnWlpYzpbyLXbKSO7x5LdGwMqf51X8OXMvh/WoI5CHgVvlfHXP3gaohzbb3j+4pAPBrdm0qPW/DMk9qx+0WrZMa9XHqK9eat7vRnkaaPqdd4m1LRtV8IX9nabBcOqtAQMlRuzt/KvMJLciRvmC89Mjiuj8Fww6q88NxujZV+UuvT24ok8Al5GLMpJOc7h/jWMWqPu30Ld5vUrjTg0vIbgZ4qZLYyQtgMOfQVbiRwQQCG78U9Yysh3nduPHHSuZ1GbKJW+yhlJXPFWLSY2hjZVLKDyD3qWWJmYDIGP1pkmcBUUkA88Vne5drancfCK2TXPEerW2nWoeW/0y4EcKD94XAEmOBk/dOB7Vyms2VvppzIX8qeZVVnUZGOcdetXfAPjrU/hj4ysdf8GXf2bVNOk8yBygZQemGB6j5n4roLzxtonjTVorXxH4fmNxqsyhprK6EQLs2M+UUx1J6Gpg3d3eljpT9rBRW9z6K0LwhqHjX4M+Etejt9qLpatsLsN5QOgJT1yg4zXo//AASesNT074+67YeLfDumfY5YJvM1G4t/MuJQ/AVd4O0DaOO27rXonhD4UTaB8HND8J6ELP8A4lNsEUySOJR3APy4z8xrqvh7BrngS7EnhewtBqkh2PJHblyT6kng18jHM4QdSKXU/QpYCeNVJ81uVI1/2jPgdJouvJefDiyGJ2LSnDfZ0BGd5A4TGe/fiv0B/wCCcf7If/DP37MWmwaoxl1TUzLrGqSsMFri4yzAZ6BUKpj2r5r/AGePgD4v+PXxF06D4sanNd2m8Xc9jwkCRqRwyr1bKjC5xg81+mPiLw1deFPhwiW7JGjJtKqvC8dK0wsPrEJPoa4zERw/s6SkuZs+NP2rfDcPxH0HXNAncvFqNu8IycgHBxkflX5hfs7/ALIOv6b4q1vTvibLJ/ZVvIbaG3jX/VsGI3H64zmv1O+JekNbeJjM7YVMrnpyTkmvGv2gfhMl5eR+K/DTTw3aptukhY/vvQhenvXD9ZlR5oxPQxWBWIcJ9j4d/am/4Jpan478TwT+CtQ0200QQKsMEk5Qhscuf9qvVv2Gf2dtc/ZQ+H+oWSanaz3GoyYLvdB1IxyWOc/TFe6+HPhrdePdDSFr611GzI+5dwFWQ+mV5qGX9h3XHuIpPDFzHboXGUS6JAGOwZOB7ZNXDHVXDkvdHHPA4Xn5qisz59/ai0y18caMtj4qlgb7OoZZIzvbHqrHvXi+ofAa317wAllqlpLcW17dwWkRfHmspcHkgZJ2Lk89Oa+65/8AgnD4h1O6i+3SWl2ZQcLcT4wc+0dd14Y/YFn065tJfGJtZodO3G3tbeL9yjMrK7sxwWfBwpAwA3as6lapGK5Uaf7PFcsT4Q8K/wDBOnwTqUKzah4Q0+bC/L/Aw4/vY/nzXQ2//BL7wy0EU/hnUfFXha6dT89hqkiCIjpheePwr9Am+F2n+FkEc0CeWpyBtxzXHePYU0zUvtFhs2smFHUAn2rheZYhNqUmXTw+GqtL2aPyZ/av/wCCfPjzStC1DW9F8bal4ig0pvL8nUxvldPXf3r4n1HU9S0pbi28URQ7rcGPC4zKxPT2x71+6Hxi0OS98O3iu67Z4m3qPusSOpFfjB+0F4Qk8O/F7WLS/VQ9vct24OCefyr7Lh3N5YyPs6ltD4rijK44a1SlfU8sn86WB8BwJG3MK2PC/madL5oLxsDhe4I/iz2q/ZeE7rxOrJoqCRgPMcAEYyfeqlro1xcRTRXjTQSZACbTjivqvbwcbN6nyccLU0aWhp3kK2uviTTh+4uEVlA75GTVucAzOY2IUscD0FSaZ4bvTokl3Pab4LJioK9hjOfyqkbFmJKxgg85MgGf1rhqSTfus3lSdJJTVmR7/MZR3I5PNKyqp2/OefyqZkErrs4JGcYpTGGzsbLAZ6Vzti1IiQX+VulKk5BIyaCjcYK5NAkCPiT71DYXvoLCCZOMEnnmvTf2aPhzJ42+OngWKOMyWsniCygmbGcbpNxX8kf8vcV5mIy0pIQ9OD6195f8E0/hI1v4G8DeI9TjiH9oeNw0ZIG5lgg4x+LGuDMcQ6FFyR7WQYF4zFKK6Js/Q6+/Z2tZtcGpviDCjK+vvW3p2lWFvcC20eEysm1SETJJ+orvbaGPVYvLYFlf8QB+FdZ8O/h5bWN55kFsAGw24gAN71+dUv3jfmz9EScEu50/7LWv6D8MZL+TxVth1W5CuFkPIjA+6D0rrfjR+3n4Z0DwdPBezZ8vjOcA/Svir/gpv8RLz4QnSNZs1eC3cGCRkJABz3NfGfxn/aW1bWvh5PdaYj3twkZaDJ3KSf4j617tPFVKcI0YWVzsp5Fha9sZW1cdbH6S2Pxk0b49SZ8PzRxhckbjnfTbnOkwGy1pB+8LKuejA+lfiH8K/wDgoD8VPgN8ULCXxg6XWn3c4UIIjGYxn+EdwPev1F+HP7TsXxu8N6VcSO32+Tay7zjJJHH5VGOwk8I1zu/N2O3B1KeNUnSurbpnsvgTwM+g6u0mhBjZyncVPqec16XbagLIxxTIVlGMEZrW+EvhFdQ06N3Iw+d3y/yrf8Q+Coowm8cAcbV5B9c0qdGShdM8XGTpuo00Ylp48XSbhvtPmSPHzuboAe1LqnxZimsn8pzgDpgjFRar4ZjuLQA8jJBY8E4rhPFmlpa27tC20dMZxXJiK1SCtcmnQpvVIzfGXjSLVLgl5GAXqD71xXjDV4bfTnLhN4GFYnviqfinUTaylX6t098V57468ZyTWMgmlYbHwBt9BivG9pJyu2dypJJWOP8Ain45KwtGjKzv970r85P24/g5PefEW41qzgIgv7Z5mwD94cZ/E190eJPNuwZJRuLMcZrK1D4NxfFezXTbmFWknXyiSM7FNezlWK+pVOdbHnZnhVjqXI+h+ffwQ+HV1pPgO+8RrDnZuQREHMo7EfQ11GifBl/GWmzzQ2btdxgO7LGRwfY17L+0p8K9X/Zv1rTtFsYsWcD/AG0AqNsy7vu19gfsVeCdE+PHh+eS20+GK9nsxEUCAZIHOK9upj51bVU9Gx4LJqUaai12PiH4Ffs5R+PPhp8T7SaPY9l4cfUoAVOd8Lhj9M8D8a+LptyzOBCzAE8g9a/ZP4reA7H9kL9mf4n+J9Sj23OoaNLotlGBgDzZXBJ9/kFfjs5ldiVUAE5x6V62WVJVIuTPm+LaNGlXgodh+fLyIlO/1x+dRP8Au3bH3j/KnxgyP+8ZmGMBh2pu0FsZJIOM+teqknufG8xGq+aBk4xTjEJBz271MUUyADIH0pskIUkr8q560mzO1tiLADjBGO5ya/VL9iTwpNr/AME/gNZeGU/cW0F7q87oP41nmMhPvtAHrX5X+Tsf7+7PTiv1z/4Is6jd6p+yLcXDqzT+HrvUbS0YruISRIZCo+rM49s14mewc8PofZcFV1Rxk1Ldxdj7a+HGoJmJbj7/AB8o5GPevVrLVAsMceSm7gYOABXz/wDCfWvtkNvcplRIQNjfeQ47ivWrLxJ5TFZZkdFGT8tfD4W9Je8faVqfvtPsjkv2yfhBpPxk+Ft5ouvjzA/7xX3bih9q+Afih8A4fhx4WtIvCgfyrUeVIsgyXPTIr7s+MXjW41yRdO0SJ5HkOwsOAv41z0n7J2peNNLhMixu3ynaw3ZPvXc26myPQweJnh17r08z5G8B/s66T8UfDEZ1XR7S9u4BxNNFzG2OK94/YT/YR1k/FNtV8bzWsGi6Yd1vbpkbz2PPFfTfwm/Ywg8NaSz6s0MEj/MQvygH3r0Hw94Fl8BpIbRopY0I3BDuGa9ClTm7OqY18xlqorfqeg+GfDVtpVvGloGAUccdeKTxBaB1BbgIOeRxWFb/ABKMIIuE2FRjrVS68fxXQk80qSw4O6umrOKVkfPOlKU+ZswfFr/ZZGw2cH5ecYrzP4i6srQSFgNqj0PNdn4/8UxtExQnOOy5rxXx5r890jiSUCLkbe5r5zE1GmelRTRxHiTVFvJJXO4spITHavO/Gp80SfaMn8Oldj4iv4NPjMw3EMuBt/hNcHqGqtfPK8e6QY2kMOhrz1BLU7VLSxzV7Csksca8r0B9cV6B+z1bwReLZHkA52hckHmvPNfvFt4nL7lVQd2B0x6VlfDv4gT22vwy6cJTI06xpGpyWPpiuqnJq2lznhDnmons/wC1F8ILL9oD4u6Vo8FuZvsERikkVeCzdifqa3f2AvgNe/CL4j6hbqGXT9KikeZmyNgBI69K94+CQ8L6n4Uh1DWNIu7bW5AskryZQGTkk5+uD+Nd/oHgBL/RJBI8OlaRcS77yRGAlvABuCknoBXuUWnTSsdLxKjeB+Uv/BwX8W5dA+H/AMPfBFgzRjWjPrl6u8Auu7ZEp9vvGvyvF9Jj5uv0r7C/4LifHyy+OX7burQ+Epo59M8NWkWjwkEFQV35VfTBPXpxXxy77nJXcQTnOOtfY5ZRUcOn3PyjiDFfWsZJxei0LkS8r833vanjBJ8vmmoPkOMZX7vNCk5KksPyrpkeSSRqd20Hk8/SmSZ+7jIzT8YUFuD0pd3zERjj6daiw0Jt8tsgAjr9K/Zn/giTNp17+xlDDpMga6hvro3CD7yltuSQOecLivxm3LIxBGNvavpz/gml+3e37GfjXUotdiln8Pa8F8/Yu5oJFyVcc9PmIwOflrz8zoSr0Xy7o93h3Fxw2MXPpzaX7H64Xs48LfEK6s4o1t47grIg/u/jW7deL/JtJQWdQoBJ4+avEPhd+2X4Z/a01CfUPh5Jvl0ZEWVCpBw2QMgj/ZNdD4+1q6/4R65j0Pc1xcptQAZ5+navz+rGVCpyS3P1KMI1JK0uZd0Wvjd+07pfwl0uH7A8Z1e7jLMXIIjUdTj1968Fsf8Agq3rHgu/uDpWvNOi5yJCNoP1FP8AB/7Ges/Fzx2mp/tFX1tDoUCny9PSYtLd85Hmt0UAdFB+tfTngT9nH4KeG9Djsr/w7oUkYLOxljXLZ96+iwVGlKKcpHvUpUqFO0afN8rnxV45/wCCqXiXx3qRuJfFF1GAcLDbzkDPpgc113wz/wCCuvjDwNFBHq8t1qNgjciaMjcv1I/WvsLw/wDDD4CeEcTW/h3w3C6P9/7NG5/DNdL418ZfBvVfBy2CWnheG2YlWZoIhIQOwAHFdkoUY/bInVlUioyoaeljyLwL/wAFUfC/xG08b5E0+8wC6yMMNxzt9q7bQf2s9F8cokfh68gEwIUjcDk/SvGvGH7LPwM+LGuiSwabTpQcK+mv5Tt7nA602P8AY38MfC6J7vwRrGtT+WA3+mXG8j9BXg4yUU24SueNiqNJSulY991rxw13bP8Avegw3PU15l4t1prgFznaWIHPWsbw/wCJo7Z/Ju7gug43cnJo8UX9vPdKzMyhVxj1NeQ7y1Zgo2MnULtZMrJuVT1B7msubSNkDzQSBNxPHWpIdSS9Z0U58o4O7oCKoX2qi1sJCx2gM3OeOtLlMG3dnmvxb8RHS9Pn671yOuNw9a88+GHx2tPhb4h0jXddh8+1g1EM4PBAPfmof2nPG4t7R443VpJn2qc5bk9q8l8dkW/gfTIbjOGfzHzyTgda76VFJLWzMKWI9nUbWyP1Dh/4K7/Cux0C3t9e1HTLdggdRNKqNwPevkH9v3/gvIfF+kXPg79l278wyI/nX+SI4lbIKpwCTjuK/Ln9oHXPtnjKSOE4W3VcktnBPbHaue8BwFpbqVhlRgDAA/M197geHIRhHEVpt+XQ+Ozbi2dRzw9KFvPr8jq7+9m1S+nub+SSS4uXZ5pHO53YnO4mqhRs/N5ufY1LuO85B/LinZB/5bqPb0r1nyx0R8k25vmZaFvgEkcdehphbcSdvbg+1Ws4X5cHn36Ux4xEhKL949c1zFtEaj5FxwSBSTRExgksHB7elPXaG2gZIGTTlxsJywU9vWgHHqRxoSSXwQRS8eVt2nIPY/LQTk4ToOlEeXyGB49qV90OLTdnsfVX/BJD4oR+Cf2h59H1B9lv4js2RFHCmWMggfkW61+lpuFklEzL88XG3OAD9e9fiL8N/Glx8N/HOl69ojMLjSbqOcYOM7WyV/EZr9ivhd8ULH4nfDnS9d0SRJo9UhSQAHo2AW46jBPQ18ZxPg3Tqqqloz9H4PxcauGlRvqjU+JPidpdKkiLNDIF5YNjGf518x/EabxZYTyvol9fSKc42MW4+lfZOgfCW2+IUrfb2LSAgMf4V/xr2D4YfsoaDpe2W9ijuJmA3llBAH0NeJh4Scly7H2k80hhqfLF6n47ap8QPGh1J4L681EohIZcEGus+HcHiLxZdKssN9Kq4K71JNfsRe/sn+AJp2lm0Gxmkc58zyR8x79q0tC/Zz8J2k37rS7SKMjAAiVdo+tezVpupGy3PHjnM43bkz85Ph5JqXgKOMtbuH4JJT5l/HtXe3PxH1bWtLbynl2MQXDAAsPSvtzxL+zf4SmsnMdvAquORjmT/CvHvH3wF03StPnbR44V2k7SemO1eNOjKn8Rt/aVOslpqfOkGr28pkeaHy2/gAbk1max4kLsi2zTeWWyxY7sH0GK6Hxx4WTSJ9izoJASWAxjJ7CuOa6t7fm+l6fMMcD8ay5XIn2nNqa1rqf2a1mk3Lkk4GcZ+vvXCfE/4gi10yUFgrhcFR0H0qXxp8TbexsXjt3hGAccjmvnf4p/ExtZuJPIdiqjna3BrWjQcpK5yVpe67GNrt+/jnxzDHLuaCGTcep78Uz46ypBZ2MajZ5Sbse5/wD1Vd+EFkZLuS7uhkOy7c8kHJOK5n9qG9kgtLiXaVKRsF/Bf8c16VOlz14w6HBWap4adTrY+M/Hl0+u+MNQljBKzXBxwemTW5oemDTdOjjxgt8zD09qg0rQ1SZZb752bnr0NaZB53swPcccV+mTrJU4049D8rV5TlKQjHzWIkAx1xk03KDoqfkacqkvxk8UZK8HqOOlctl1LTuayrhASCM02RSyYPY4qfywoHJJ7iknQbTjrmufmu7F6srhMsSPoaGiPkcYwD61Iw3OFx1GaljijK7WLh+o6dPpVttLRDTU2olRImZuB1Pbg9QB/OtA+DdWS388aVqKRHnzGt5APzxXtX/BPjwbofib9oq1f4g263tlp1vLeJC65SWVcKnmA9svx24r9LdU8ZaAtqLjfb2luF2pCUzGR3GzGcV5OLzNYWryct2fsnAXhHV4zy6WPnW5Fey5VzarvqrH4uC2d/lkBO7BIA5/z719ff8ABM79p0+E9Yk8EeKpglndMZ7KSQ8RyZ5QH3r6avtC+DusXN3Lqvhnw81xdhvNY2AG/P8AtFc5NeRWf/BOrwX4m8QP4g8L+JLrQ0lufOtbG3jQw2i8DAOc44rkxOYUcVRcKqPpKngnneRVYYjBTVSKeq2du5+iHwd8Zpo+kJcbl8sEkMwGWB6V0dx+0lbaLeBTdBAVxvPAbFfLHxK1XWfgp4ZsTYNNf6TcRKIJgN3lnAzuxn/CvC/H/wAbbnxDIPJnk3KDtAY8fhXydCpr7p5ssonGTVTV63t0fY/QmX9s+yLSx2Vyv7joN33veoT+2jEZYwsqltpO0vX5e3Xxn1LSLtCrSlkG0H+9Sz/GjUJQn2m98rHcHnn1rtane6ZzPL1e3IfpNr37a1vcWBaW58t87VVWrz/4kfth21ppZUXYMeCWbfkj2xXwnd/Fe8W0ZBdtIQeDwc1ymra9q+uTt5pkMb8kk+tYypub95nPPBypaKJ7d8UP2qP7cvybKfgybiea4vVPjPcalp2d8hOMcnFeZ2+hS3N0FiLFs43EHg1rQaC9v8l25K55NElThojKNCprcNb8XXOq+ZvlcLnArBeETTiGLdhyCxPetrUNLjsw5c8ZO056Cq/hezGqazsDDGQN1ap6aHNUi07HpXw40IQaWqhU+Y5BHUADrXjP7VsS2OiOkrs7MDuLMcEk19G+E9HFvpeI1DbVwG9a+aP2x7xG8yFThgwXFb5cnPExucWa/u8JI+ePK/hhAOOcA9BTSwVsupZuxpCgab0AGQR3p0kmSDg/jX36tI/Mm7IjVd0pPzcn1pzTsrEBQce4o3gvhiAetBVicqFIPQ8c0pNolWN8srYI6GmuhVzjnPvSCYbOOw4pqSGMAuCS3X2P+RWUu5vrJpdB/lFgCxCt7nHHr9PevU/g5+xx4o+K1vHfzRLo2hyP813e5iD55yifebjucCvXP2WP2TdK8O+FLfx18dIYbhpEFxpmlSZwQOFmnHtxtXoRycVq/Ej436j8S/HuneH/AA3exWdvcuLaN2YLHEp67FHA44rzK2OlK8KR/Rvh94LRxuGp5pn940p25YLeSe132fyN/wCDfwr8Cfs2TzyWmsC81K7j8qe5ndQCOOFA6cqOK7a/8U6brzBdM1K3mZRjYWyVNeb6zp7eGfEq+H/hxptpI0C77vVtRTeXPd8njHXCgVrW/gjSNd8OBraLz7oMyrdRr5RYg4yAvbI7149ePNLnm7n9TZVkGDyfDLBYCgoU4bqzWv37+Zb1W9fSL0RamglhPqPu+9T219PaR+Zos+IXwdofg85wK4ZPFdxpOonSfEYkmgY7EZv9YO2Se4rS07Wf+EV1Fra52y2cnKnsuelYyp316G1OdOS5Kq0Puz9mv4o6D8ZPDo8P3cB+02dukZtpgGDkKAWHtxXK/tN/si6XN4cuLrwfYW9teIGYtDw2PpXzZ4R8a3fgfxJZa14ZuZILm3dWEkbY3r3U+xr7r+Evxv0n9oLwKbmydF1G3Xy7u0fG5GxyR7Z6V5FSg6ErxP54464Vr8PV5YnDXdCTbflc/Krxxomp+CdYkhvnn/dMRiRfes1fFzxDbdpGZCQCSg/KvtL9sD4DDWWe6sLaEbcmQ4+YmvkPxN4M/s+9eG4iK7Seq8iu+jOFVW6nwsMROLWt79Saz8R2t3EqiBFYdcAVppLbTIDGoJ6HOeK5iy8NSxTBoQ2D+Fbml2nkk7ssSairQs9Gdir83xI14bCMOrq2NrDgDsBVfVrxYkaOQZZuAMVdRfOX5cjnNPtdBF7fK7DcORzXM6VndnnYq/2Tj9UMkhK7fkxkkjoK3fhv4YDakkm1gpPHGd1WfE+hiG2aOHLKV27R1zmuh+GVitrNFuVmI+vWultKnc8NpuorndmP+y/DrMh2bARz2yOK+Mf2rtZN5q4L/eMmMA9QOCa+w/F8sj6JI04xEpweehxXw3+0BdvdeKZFVC0URxuzkBvTNdeTxc6yZ5vEcmsM0tzzZ1V3+XdjGOtI7FCoB6CnTrtJwSM84x0pqgoWEnfoa+2gk1ofmN+ZaDVP8Q2liakGWGQDzUMS+S6446k1ILpAOS+foa0kkkgSNoL1xzipbMhNRTzgWQFdwyORyc/h0qCM/M31p9tz52fT/GuSp8LO/BycMTTkujv9x9H+NvjRqll4luYLy4drOTCwrniJSuVUdtvNZXwn+DHir45fEWKP4f8AlwjTdtxNdTuVigGcD8T2AzXM/GDhLYjg/ZoTn/gAr6R/4JjTO1nqIZ2Ie9h3c/ewnGa4KtqNJzitT+7MDXlmboYGs3yKMJaO3S9vS50HxD/Z58b/APCILZDV9GLxgiSVVcNcDsCcZ/OuR8AeJbn4cx2uieNZIjPa/u/MjyFOGPr1+tfWPiobtJJbk7P6V8lftMwot/vVVDg8MByPxrxlN1PdZ+r8rhF4vmd1pbpb/M3fiD4VTxTbpqGiBVuYiCDjO9R2/wDr1y9/cxagotr1PLlxymOQ3r9K2fhTdyy+EIDLLIxyByxPFZXxOQQ6hbPCAjmTBZeCRn1qUuSTj2OXHwjKi60Va/8AWhU0zWZdJuBaaiSU6ox6D2zXc/Df4n6r8LvFNtrXhSYJKDtmRzhJkPUMO/sa4HxcP+JVGe+/rU1pKzaKhZmJ46n2qqlOM1r1PHr0qeNpSw1dc0Gup9zeFfirov7QPhgG0kQXka4ntXcblOOSB1IzXjPxu+CkX2yWWFFG0dhgfrXlXwWvZrD4i2TWM0sLOyqxjYqWHocV9P8Aj8+dpchl+Ynuea+frp4eraLP524kyallGNdKi/cfTsfKGpeGjYzyRgD5DgCqp06KJThQSeh9K7Lx8gXU32gDk9B71zIAJ5FdFOq5M8KEtNd7lOwjC3GMZGea6Wylt4rZRtG4g81hyjY/y8c9qSR2weT09aicmFZJxuJq8ivN+6Acdfl61teALJ553aUlFABVR1PrWLo6gxsSATmur8Ej/TD9auT9yx8/NWm2XfidqH2bwjKYsokIYgHGWOO9fBieLBfeM9RGoBLi3knKGJhxgEjI96+5/jl8vgu+28fuGPH+7X506C5bVpixJO9v519Dw7TU4Tm9xxjCWIjGcU0+52fib4Tzy6dPqXg4+fYqAzwDBnhB56dSo9RXDSRMC4YHIODxjFe4/CuZ1S32uw8x1VsH7w9D6iuM/acs4bL4rXSWcUcSMuSqKFBPuBXs0K8lLkZ43G3CmFyunHFYdtc26POxHyTJkcU9bMlQVJwRTs/epwc4HJ/OvSbPzBLk0ep//9k=\nX-ABUID:ABD22CBA-0AA7-4A8A-BD2A-2AD566FC2BD2\:ABPerson\nEND:VCARD\n'
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
		//div.textfill({ maxFontPixels: 600 });
		return div;
	};
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * YOUTUBE */
	var addYoutube = function(uri) {
		var iframe = $('<iframe title="YouTube video player" width="853" height="510" src="' + uri + '?rel=0&autoplay=1" frameborder="0"></iframe>');
		iframeDiv = $('<div></div>').
			append(iframe).
			attr('class', 'image').
			appendTo('#wall');

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
		iframeDiv = $('<div></div>').
			append(iframe).
			attr('class', 'image').
			appendTo('#wall');

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
		iframeDiv = $('<div></div>').
			append(iframe).
			attr('class', 'image').
			appendTo('#wall');

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
		$('#manual').hide();

		if (iframeDiv !== undefined) {
			$(iframeDiv).remove();
			iframeDiv = undefined;
		}
        
		var firstContent = data[0]['data'][0],
		preview = firstContent.preview;
		
		if (firstContent.type.match(/^text\/x-vcard/)) {
			showVcard(firstContent.content);
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
	
	
	/*
	function create_zip() {
		var zip = new JSZip();

		var obj = $(".image img").attr("src");
		$.each( obj, function() {
			zip.file(obj);
		});
		
		//zip.file("hello.txt", "Hello World\n");

		var blobLink = document.getElementById("download_button");
		try {
			blobLink.download = "hoccer.zip";
			blobLink.href = window.URL.createObjectURL(zip.generate({type:"blob"}));
		} catch(e) {}
	}
	$("#download_button").click(create_zip());
	*/
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