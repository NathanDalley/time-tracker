
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
  app.directive('newTimer', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return {
        restrict : 'E',
        scope : {
            startTime : '@',
            endTime : '@',
            state : '@'
        },
        link : link
    };


    function link(scope, element, attrs) {
                  //var format = "HH:MM:ss"  // date format
                  var timeoutId; // timeoutId, so that we can cancel the time updates
                  var startTime;
                  var endTime;
                  var state = false;

                  attrs.$observe('startTime', function(value) {
                      startTime = new Date(value);
                      //console.log("Start:" + startTime);
                  });

                  attrs.$observe('endTime', function(value) {
                      endTime = new Date(value);
                      //console.log("End:" + endTime);
                  });

                  attrs.$observe('state', function(value) {
                      state = (value === 'true');
                      //console.log("State:" + state);
                      if(state){
                          updateLater();
                      }
                      else {
                          $timeout.cancel(timeoutId);
                          updateTime();
                      }

                  });


                  // used to update the UI
                  function updateTime() {
                      var now, then, seconds, minutes, hours, difference_ms ;


                        if(state){ //Timer is on
                            now = new Date();
                            then = new Date(startTime);
                        }
                        else{  //Timer is off
                            now = new Date(endTime);
                            then = new Date(startTime);
                        }

                        //Now calculate the diffence between the two times and break it down!
                        difference_ms = now - then;

                        difference_ms = difference_ms/1000;
                        seconds = Math.floor(difference_ms % 60);
                        difference_ms = difference_ms/60;
                        minutes = Math.floor(difference_ms % 60);
                        difference_ms = difference_ms/60;
                        hours = Math.floor(difference_ms);


                        // Present it!
                        element.html(hours +  ":" + minutes + ":" + seconds);

                  }

                  // schedule update in one second
                  function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                      updateTime(); // update DOM
                      updateLater();
                    }, 1000);
                  }

                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time ofter the DOM element was removed.
                  element.bind('$destroy', function(timeoutId) {
                    $timeout.cancel(timeoutId);
                  });

                  updateLater(); // kick off the UI update process.
    };

  });





  // Register the 'myCurrentTime' directive factory method.
  // We inject $timeout and dateFilter service since the factory method is DI.
  app.directive('theTimer', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function($scope, element, attrs) {
      //var format = "HH:MM:ss",  // date format
      var timeoutId; // timeoutId, so that we can cancel the time updates
      var startTime = new Date();

      $scope.$watch('myState', function(){
          if($scope.myState){
            startTime = $scope.myState.checkedIn;
          }
          //console.log(startTime);
      })


      // used to update the UI
      function updateTime() {
          var now = new Date();
          var then = new Date(startTime);

          var difference_ms = now - then;


          difference_ms = difference_ms/1000;
          var seconds = Math.floor(difference_ms % 60);
          difference_ms = difference_ms/60;
          var minutes = Math.floor(difference_ms % 60);
          difference_ms = difference_ms/60;
          var hours = Math.floor(difference_ms);


          element.html(hours +  ":" + minutes + ":" + seconds);

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



