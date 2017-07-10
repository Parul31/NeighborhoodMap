//the model
var initialLocations = [
// 	{
// 		title: 'Allahabad', 
// 		location: {lat: 25.4358, lng: 81.8463}
// 	},
// 	{
// 		title: 'New Delhi', 
// 		location: {lat: 28.6139, lng: 77.2090}
// 	},
// 	{
// 		title: 'Goa', 
// 		location: {lat: 15.2993, lng: 74.1240}
// 	},

// 	{
// 		title: 'Mumbai', 
// 		location: {lat: 19.0760, lng: 72.8777}
// 	},
// 	{
// 		title: 'Shirdi', 
// 		location: {lat: 19.7669, lng: 74.4773}
// 	},
// 	{
// 		title: 'Tirupati', 
// 		location: {lat: 13.6288, lng: 79.4192}
// 	},
// 	{
// 		title: 'Bengaluru', 
// 		location: {lat: 12.9716, lng: 77.5946}
// 	},
// 	{
// 		title: 'Jammu and Kashmir', 
// 		location: {lat: 33.7782, lng: 76.5762}
// 	},
// 	{
// 		title: 'Mysuru', 
// 		location: {lat: 12.2958, lng: 76.6394}
// 	},
// 	{
// 		title: 'Chennai', 
// 		location: {lat: 13.0827, lng: 80.2707}
// 	}
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
            stylers: [
              { color: '#19a0d8' }
            ]
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
	var defaultIcon = makeMarkerIcon('D2D229');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	for (var i = 0; i < initialLocations.length; i++) {
		//set markers on the map
		var marker = new google.maps.Marker({
			position: initialLocations[i].location,
			title: initialLocations[i].title,
			animation: google.maps.Animation.DROP,
			id: i,
			icon: defaultIcon,
			map: map
		});
		markers.push(marker);
		//open a infowindow on clicking the marker
		marker.addListener('click', function() {
			populateInfo(this, infoWindow);
		});
		marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
         });
        marker.addListener('mouseout', function() {
        	this.setIcon(defaultIcon);
      	});
	}	
};
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
//populateInfo() to show photo of the place and some details on the infowindow
function populateInfo(marker, infoWindow) {
	if(infoWindow.marker != marker) {
		infoWindow.marker = marker;
		var address = marker.position.lat() + ', ' + marker.position.lng();
		//streetview for getting photos
		var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=250x200&location=' + address + '';
		
		var city = marker.title;
		var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ city 
						+ '&format=json&callback=wikiCallback';
		//mediaWiki
		$.ajax({
			url: wikiUrl,
			dataType: "jsonp",
			success: function(response) {
				var articleList = response[1];
				var detailsList = response[2];
				var article = articleList[0];

				var details = detailsList[0];
				if(!details) {
					details = '';
				}
				var url = 'http://en.wikipedia.org/wiki/'+article;
				if(!article) {
					article = marker.title;
					url = 'https://www.google.com/search?&q='+article;
				}
				var morePhotos = 'https://www.google.com/search?tbm=isch&q='+article;
				//set the content of infowindow after fetching it from streetview and mediaWiki
				infoWindow.setContent('<div style="width:252px; padding: 2%;"><h4>'+ marker.title + '</h4>' +
											'<a href="'+morePhotos+'" title="Click for More Photos"><img src="' + streetviewUrl + '"></a>' + 
											'<p style="text-align: justify; padding:2%;">'
												+details+
												'<a style="font-size: 14px;" href="' + url + '">'+'--See More</a></p>' + 
									   '</div>');
			},
		}).fail(function() {
			alert('failed');
		});

		infoWindow.open(map, marker);
		 
		infoWindow.addListener('closeclick', function() {
			infoWindow.marker = null;
		});
	}
}
function mapErrorHandling() {
	$('#map').append('<p>Oops! Map is unavailable for now</p>');
}
var place = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
}
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
		markers[markerIndex].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			markers[markerIndex].setAnimation(null);
		}, 1200);
		var infoWindow = new google.maps.InfoWindow();
		populateInfo(markers[markerIndex], infoWindow);
	}
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
			return ko.utils.arrayFilter(this.placeList(), function(item, index) {
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
}
ko.applyBindings(new ViewModel());