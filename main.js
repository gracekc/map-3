//MODEL
var infoWindow;
//first an array of the various locations for my markers
var attractions = [
    {name: "The Eiffel Tower", position: {lat: 48.8582, lng: 2.2945}, desc: "The Eiffel Tower was built as an entrance for the 1889 World Fair.", id: "51a2445e5019c80b56934c75", visible: ko.observable(true)},
    {name: "The Louvre", position: {lat: 48.8611, lng: 2.3364}, desc: "The Mona Lisa is housed at the Louvre", id: "4adcda10f964a520af3521e3", visible: ko.observable(true)},
    {name: "The Arc de Triomphe", position: {lat: 48.873756, lng: 2.294946}, desc: "The Arc de Triomphe was built in the early 19th century", id: "4adcda09f964a520de3321e3", visible: ko.observable(true)},
    {name: "The Notre Dame", position: {lat: 48.8530, lng: 2.3498}, desc: "Notre Dame, or 'Our Lady of Paris', is a Catholic cathedral", id: "4adcda09f964a520e83321e3", visible: ko.observable(true)},
    {name: "The Pantheon", position: {lat: 48.8461, lng: 2.3458}, desc: "The Pantheon was originally built in dedication to St. Genevieve", id: "4adcda09f964a520ea3321e3", visible: ko.observable(true)}
    ];

var map;
var start;
var end;
var days;
var currentInfoWindow;
var viewModel;

//rendering the map and giving it coordinates
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 48.8567, lng: 2.3508},
   });
  viewModel = new ViewModel();
    ko.applyBindings(viewModel);
  } 


//VIEW MODEL
function ViewModel() {
  
var self = this;

self.Attractions = ko.observableArray(attractions);         


self.query = ko.observable('');

 self.search = function() {
  console.log(self.Attractions());
        //self.Attractions.removeAll();
        for(var x = 0; x < self.Attractions().length; x++) {
          self.Attractions()[x].visible(false)
          self.Attractions()[x].marker.setVisible(false)

          if(self.Attractions()[x].name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
           self.Attractions()[x].visible(true);
           self.Attractions()[x].marker.setVisible(true);
          }
        }
      }

self.query.subscribe(self.search);

  
  self.markers = [];


  self.Attractions().forEach(function(attraction) {
    var marker = new google.maps.Marker({
      position: attraction.position,
      map: map,
      title: attraction.name
    });

    attraction.marker = marker;
    



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

          attraction.infoWindow = infoWindow;
          attraction.marker.addListener('click', function() {
           if(currentInfoWindow !== undefined){

            currentInfoWindow.close();
           }
           currentInfoWindow = attraction.infoWindow;
            attraction.infoWindow.open(map, this);
            attraction.marker.setAnimation(google.maps.Animation.BOUNCE);
            
            setTimeout(function () {
              attraction.marker.setAnimation(null);
            }, 1500);

          });


        }
        });

     self.listViewClick = function(attraction) {
      attraction.marker = marker;
         google.maps.event.trigger(attraction.marker, 'click');
        if (attraction.name) {
            attraction.marker.setAnimation(google.maps.Animation.BOUNCE); // Cause markers to bounce when clicked
           } 
            setTimeout(function() {
              attraction.marker.setAnimation(null); // End marker animation after 2 seconds 
            }, 1500);

}

      });

}


    

