
function TimeKeeperController($scope){

    var startTime = new Date("2013-11-11T04:56:50.038Z");
    //var today = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.today = startTime;


    $scope.theHours = startTime.getHours();
    $scope.theMinutes = startTime.getMinutes();
    $scope.theSeconds = startTime.getSeconds();


    $scope.update = function(){
        var cTime = new Date();
        var theDate = new Date(cTime - startTime);
        $scope.current = cTime;
        $scope.theDiff = theDate;

        $scope.theHours = theDate.getUTCHours();
        $scope.theMinutes = theDate.getMinutes();
        $scope.theSeconds = theDate.getSeconds();
    };
}



angular.module('timekeeper', [])
  // Register the 'myCurrentTime' directive factory method.
  // We inject $timeout and dateFilter service since the factory method is DI.
  .directive('theTimer', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var format = "HH:MM:ss",  // date format
      timeoutId; // timeoutId, so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
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
      element.bind('$destroy', function() {
        $timeout.cancel(timeoutId);
      });

      updateLater(); // kick off the UI update process.
    }
  });
angular.module('timekeeper').run();

