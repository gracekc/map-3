//MODEL
//first an array of the various locations for my markers ADD IDS
var Attractions = [
    {name: "The Eiffel Tower", position: {lat: 48.8582, lng: 2.2945}, desc: "The Eiffel Tower was built as an entrance for the 1889 World Fair.", id: "51a2445e5019c80b56934c75"},
    {name: "The Louvre", position: {lat: 48.8611, lng: 2.3364}, desc: "The Mona Lisa is housed at the Louvre", id: "4adcda10f964a520af3521e3"},
    {name: "The Arc de Triomphe", position: {lat: 48.873756, lng: 2.294946}, desc: "The Arc de Triomphe was built in the early 19th century", id: "4adcda09f964a520de3321e3"},
    {name: "The Notre Dame", position: {lat: 48.8530, lng: 2.3498}, desc: "Notre Dame, or 'Our Lady of Paris', is a Catholic cathedral", id: "4adcda09f964a520e83321e3"},
    {name: "The Pantheon", position: {lat: 48.8461, lng: 2.3458}, desc: "The Pantheon was originally built in dedication to St. Genevieve", id: "4adcda09f964a520ea3321e3"}
    ];

/*function infoContent(attraction) {
    return ('<div id="content">'+ 
    '<div id="sideNotice">' + 
    '</div>' +
    '<h2 id="firstHeading" class="firstHeading"> + attractions</h2>' +
    '<div id="bodyContent">' +
    '<p>The Arc de Triomphe was built in the early 19th century</p>' +
    '</div>'+
    '</div>';)
} */
var infoWindow;

//rendering the map and giving it coordinates
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 48.8567, lng: 2.3508},
   });
  ko.applyBindings(ViewModel);
  } 

//VIEW MODEL
function ViewModel() {

  var self = this;
  self.markers = [];

  self.Attractions().forEach(function(attraction) {
    var marker = new google.maps.Marker({
      position: attraction.position,
      map: map,
      title: attraction.name
    });

    attraction.marker = marker;
    marker.setVisible(true);
    self.markers.push(marker);

    ///Foursquare component, accessing each attraction's hours
      $.ajax({
          type: "GET",
          url: 'https://api.foursquare.com/v2/venues/' + attraction.id + '/hours',
          dataType: 'json',
          cache: false,
          async: true
      });
          var infoWindow = new google.maps.InfoWindow({
            content: '<div id="content">'+ 
            '<div id="sideNotice">' + 
            '</div>' +
            '<h2 id="firstHeading" class="firstHeading">attraction.name</h2>' +
            '<div id="bodyContent">' +
            '<p>attraction.desc</p>' +
          '</div>'+
          '</div>'
          });

          attraction.infoWindow = infoWindow;
          attraction.marker.addListener('click', function() {
            infoWindow.open(map, this);
            attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
              attraction.marker.setAnimation(null);
            }, 1000);
          });
      });
 

  self.query = ko.observable('');

self.search = ko.computed(function () {
  return ko.utils.arrayFilter(self.Attractions, function (listResult) {
    var result = listResult.name.toLowerCase().indexOf(self.query().toLowerCase());
    if (result === -1) {
      listResult.marker.setVisible(false);
    } else {
      listResult.marker.setVisible(true);
    }
    return result >= 0;
  });
});

}








