

//MODEL
var infoWindow;
//first an array of the various locations for my markers
var attractions = [
    {name: "The Eiffel Tower", position: {lat: 48.8582, lng: 2.2945}, desc: "The Eiffel Tower was built as an entrance for the 1889 World Fair.", id: "51a2445e5019c80b56934c75"},
    {name: "The Louvre", position: {lat: 48.8611, lng: 2.3364}, desc: "The Mona Lisa is housed at the Louvre", id: "4adcda10f964a520af3521e3"},
    {name: "The Arc de Triomphe", position: {lat: 48.873756, lng: 2.294946}, desc: "The Arc de Triomphe was built in the early 19th century", id: "4adcda09f964a520de3321e3"},
    {name: "The Notre Dame", position: {lat: 48.8530, lng: 2.3498}, desc: "Notre Dame, or 'Our Lady of Paris', is a Catholic cathedral", id: "4adcda09f964a520e83321e3"},
    {name: "The Pantheon", position: {lat: 48.8461, lng: 2.3458}, desc: "The Pantheon was originally built in dedication to St. Genevieve", id: "4adcda09f964a520ea3321e3"}
    ];


var map;
var start;
var end;
var days;
var viewModel;

//rendering the map and giving it coordinates
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 48.8567, lng: 2.3508},
  });
  ko.applyBindings(viewModel);
  } 



//VIEW MODEL
function ViewModel() {
viewModel = new ViewModel();


var attractions = ko.observableArray();    // Initially an empty array
attractions(attractions);         

var query = ko.observable('');

      function search(value) {
        ViewModel.attractions.removeAll();
        marker.setMap(null);
        for(var x in attractions) {
          if(attractions[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            ViewModel.attractions.push(attractions[x]);
            attractions[x].marker.setMap(map);
          }
        }
      }

ViewModel.query.subscribe(viewModel.search());

    ko.applyBindings(viewModel);
  
  search();

  var self = this;
  self.markers = [];
  self.Attractions = ko.observableArray(attractions());

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
     
    var ClientID = "?client_id=CJIJLBUPBHEZM4MMIIJQ00EYCOGOQJ3FOKXTBD45JQNAV25L";
    var ClientSecret = "&client_secret=ASCY0W0MVKXQXWGIDT3AIL1GOQBOZDXXEH11YN3MRZXWYWFQ";

      $.ajax({
          type: "GET",
          dataType: 'json',
          cache: false,
          url: 'https://api.foursquare.com/v2/venues/' + attraction.id + '/hours' + ClientID + ClientSecret + '&v=20160703',
          
          async: true,
          success: function(data) {
            console.log(data.response.hours.timeframes[0].open[0].start);
            console.log(data.response.hours.timeframes[0].open[0].end);
            console.log(data.response.hours.timeframes[0].days);
            
            start = (data.response.hours.timeframes[0].open[0].start);
            end = (data.response.hours.timeframes[0].open[0].end);
            days = (data.response.hours.timeframes[0].days);

          var infoWindow = new google.maps.InfoWindow({
            content: '<div id="content">'+ 
            '<div id="sideNotice">' + 
            '</div>' +
            '<h2 id="firstHeading" class="firstHeading">' + attraction.name +'</h2>' +
            '<div id="bodyContent">' +
            '<p>' + attraction.desc + '</p>' +
            '<p> Open from: ' + start + ' to ' + end + '</p>' +
            '<p> On: ' + days + '</p>' +
          '</div>'+
          '</div>'
            
          });

           infoWindow = attraction.infoWindow;
          attraction.marker.addListener('click', function() {
            infoWindow.open(map, this);
            attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
            


            setTimeout(function () {
              attraction.marker.setAnimation(null);
            }, 1500);

          });
        }

      });

  


});
}




