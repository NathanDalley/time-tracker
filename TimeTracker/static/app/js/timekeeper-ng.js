
var app = angular.module('timekeeper', ['ngRoute', 'ttService']);


//Setup RouteProvider
app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        controller: 'MainController',
        templateUrl: 'app/partials/Main.html'
    })
    .when('/Test-Time', {
        controller: 'TimeTestingController',
        templateUrl: 'app/partials/TimeTesting.html'
    })
    .when('/ListUsers', {
        controller: 'ListUsersController',
        templateUrl: 'app/partials/ListUsers.html'
    })
    .when('/MyState', {
        controller: 'MyStateController',
        templateUrl: 'app/partials/MyState.html'
    })

    .otherwise({ redirectTo: '/' });

}]);



  // Register the 'myCurrentTime' directive factory method.
  // We inject $timeout and dateFilter service since the factory method is DI.
  app.directive('theTimer', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function($scope, element, attrs) {
      var format = "HH:MM:ss",  // date format
      timeoutId; // timeoutId, so that we can cancel the time updates
      var startTime = new Date();

      $scope.$watch('myState', function(){
          if($scope.myState){
            startTime = $scope.myState.checkedIn;
          }
          console.log(startTime);
      })


      // used to update the UI
      function updateTime() {
          var now = new Date();
          var then = new Date(startTime);
          element.text("NOW: " + now + "    THEN: " + then + "<br />  " + new Date(now - then) );
        //element.text(dateFilter(d, format));
          //var theState = MyState.getCurrentState();

          /**
           * STUFF GOES HERE TO UPDATE THE UI
           * Do I call out to something else?
           * Do I dump all my code here?
           * Whaaaaaaat?
           */
      }

      // schedule update in one second
      function updateLater() {
        // save the timeoutId for canceling
        timeoutId = $timeout(function() {
          updateTime(); // update DOM
          updateLater(); // schedule another update
        }, 1000);
      }

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time ofter the DOM element was removed.
      element.bind('$destroy', function(timeoutId) {
        $timeout.cancel(timeoutId);
      });

      updateLater(); // kick off the UI update process.
    }
  });



