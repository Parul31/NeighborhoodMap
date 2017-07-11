//the model-- locatins have been hard coded
var initialLocations = [
	{
		title: 'Supreme Court of India',
		location: {lat: 28.622301, lng: 77.239372}
	},
	{
		title: 'Parliament of India',
		location: {lat: 28.617214, lng: 77.208127}
	},
	{
		title: 'Akshardham',
		location: {lat: 28.612673, lng: 77.277262}
	},
	{
		title: 'Red Fort',
		location: {lat: 28.656159, lng: 77.24102}
	},
	{
		title: "Humayun's Tomb",
		location: {lat: 28.593282, lng: 77.250749}
	},
	{
		title: 'Lotus Temple',
		location: {lat: 28.553492, lng: 77.258826}
	},
	{
		title: 'Connaught Place',
		location: {lat: 28.631451, lng: 77.216667}
	},
	{
		title: 'India Gate',
		location: {lat: 29.097314, lng: 77.405785}
	},
	{
		title: 'Qutub Minar',
		location: {lat: 28.524428, lng: 77.185456}
	}
];
var markers = [];
var map;
// initMap() to add a simple map with web page
function initMap() {
	var styles = [
		{
			featureType: 'water',
            stylers: [{ color: '#19a0d8' }]
		},
		{
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
        },
		{
			featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
		},
		{
			featureType: 'landscape.natural',
	        elementType: 'geometry.stroke',
			stylers: [{color: '#dfd2ae'}]
		},
		{
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
        }
	];
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 28.613939, lng: 77.209021},
		styles: styles,
        zoom: 12
	});
	var infoWindow = new google.maps.InfoWindow();
	//default icon color of marker
	var defaultIcon = makeMarkerIcon('D2D229');
	//icon color on hover
	var highlightedIcon = makeMarkerIcon('FFFF24');
	initialLocations.forEach(function(location, index) {
		//set markers on the map
		var marker = new google.maps.Marker({
			position: location.location,
			title: location.title,
			animation: google.maps.Animation.DROP,
			id: index,
			icon: defaultIcon,
			map: map
		});
		markers.push(marker);
		//open a infowindow on clicking the marker
		marker.addListener('click', function() {

			bounce(this);
			populateInfo(this, infoWindow);
		});
		marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
         });
        marker.addListener('mouseout', function() {
        	this.setIcon(defaultIcon);
      	});
	});
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
	  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	  '|40|_|%E2%80%A2',
	  new google.maps.Size(21, 34),
	  new google.maps.Point(0, 0),
	  new google.maps.Point(10, 34),
	  new google.maps.Size(21,34));
	return markerImage;
}
//This function takes the current marker and setAnimation as BOUNCE
function bounce(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
		marker.setAnimation(null);
	}, 1400);
	map.setZoom(13);
	map.setCenter(marker.position);
}
//populateInfo() to show photo of the place and some details on the infowindow
function populateInfo(marker, infoWindow) {
	if(infoWindow.marker != marker) {
		infoWindow.marker = marker;
		var address = marker.position.lat() + ', ' + marker.position.lng();
		//streetview for getting photos
		var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=250x200&location=' + address + '';	
		
		var place = marker.title;
		var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ place + '&format=json&callback=wikiCallback';
		//error handling for wiki requests
		var wikiErrorHandling = setTimeout(function() {
			infoWindow.setContent('<div style="width:252px; padding: 2%;"><h4>'+ place + '</h4>' +'<img src="' + streetviewUrl + '">' + 
				'<p class="wiki" style="text-align: justify; padding:2%;"></p>' + '</div>');
				$('.wiki').text('Failed to get wikipedia resources');
			}, 2500);
		//mediaWiki
		$.ajax({
			url: wikiUrl,
			dataType: "jsonp",
			success: function(response) {
				clearTimeout(wikiErrorHandling);
				//list of names of places
				var articleList = response[1];
				//list of details of those places
				var detailsList = response[2];
				//filtered place is in articleList[0]
				var article = articleList[0];
				//filtered place's details is in detailsList[0]
				var details = detailsList[0];
				var url = 'http://en.wikipedia.org/wiki/'+article;
				//google link to more photos
				var morePhotos = 'https://www.google.com/search?tbm=isch&q='+article;
				//set the content of infowindow after fetching it from streetview and mediaWiki
				infoWindow.setContent('<div style="width:252px; padding: 2%;"><h4>'+ marker.title + '</h4>' +
				'<a href="'+morePhotos+'" title="Click for More Photos"><img src="' + streetviewUrl + '"></a>' + 
				'<p class="wiki" style="text-align: justify; padding:2%;">'+details+
				'<a class="wiki" style="font-size: 14px;" href="' + url + '">'+'--See More</a></p>' + 
									   '</div>');	
			}
		});

		infoWindow.open(map, marker);
		 
		infoWindow.addListener('closeclick', function() {
			infoWindow.marker = null;
		});
	}
}
function mapErrorHandling() {
	console.log('map load problem');
	$('#map').append('<p>Oops! Map is unavailable for now</p>');
}
var place = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
};
//the viewModel
var ViewModel = function() {
	var self = this;
	this.placeList = ko.observableArray([]);
	//filling the observableArray
	initialLocations.forEach(function(places,index) {
		self.placeList.push(new place(places));
	});
	//make the marker bounce + open infowindow when corresponding place is clicked on viewlist
	this.setMarker = function(item) {
		var markerIndex;
		self.placeList().forEach(function(place,index) {
			if(place.title() == item.title()) {
				markerIndex = index;
				return;
			}
		});
		bounce(markers[markerIndex]);
		var infoWindow = new google.maps.InfoWindow();
		populateInfo(markers[markerIndex], infoWindow);
	};
	this.query = ko.observable('');
	//to filter the places and view the filtered list and markers
	this.filterPlaces = ko.computed(function() {
		var filter = self.query().toLowerCase();
		if(!filter) {
			markers.forEach(function(marker) {
				marker.setVisible(true);
			});
			return this.placeList();	
		} else {
			//ko.utils.arrayFilter() is used to allows us to pass 
			//in an array and control which items are included 
			//based on the result of the function executed on each item.
			return ko.utils.arrayFilter(this.placeList(), function(item, index) {
				//We pass our array of items into ko.utils.arrayFilter 
				//and return true only when the filter condition is true
				var match = item.title().toLowerCase().indexOf(filter) > -1;
				if(item.title().toLowerCase().indexOf(filter) > -1) {
					markers[index].setVisible(true);
				} else {
					markers[index].setVisible(false);
				}
				return match;
			});
		}
	}, this);
};
ko.applyBindings(new ViewModel());