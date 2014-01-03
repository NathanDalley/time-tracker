/**  Main Page Controller
 *
 */
app.controller('MainController', ['$scope', 'TimerService', function($scope, TimerService){

    TimerService.init();
    $scope.timer = TimerService.state;

    $scope.start = TimerService.start;
    $scope.stop = TimerService.stop;


}]);

/** Today Controller
*   Displays a list of all the Time untis recorded for today
*/
app.controller('TodayController', ['$scope', '$resource', function($scope, $resource){
    var res = $resource('/api/v1/timeunit/?checkedIn__gte=:start&checkedOut__lte=:end');

    var today = new Date();

    $scope.start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    

    var stuff = res.get({start:$scope.start.toISOString(), end:$scope.end.toISOString()});
    $scope.stuff = stuff;

    $scope.today = today.toDateString();
}]);

/** Week Controller
*   Displays a summary of each day of the week
*   Each week is Monday - Sunday.  This can be changed by setting weekStart to a value 0-6
*/
app.controller('WeekController', ['$scope', '$resource', '$q', function($scope, $resource, $q){
    //@TODO: Pagination will limit each day to 20 resources!!!1 Fix this
    var res = $resource('/api/v1/timeunit/?checkedIn__gte=:start&checkedOut__lte=:end');
    var weekStart = 1; // 0 = sunday, 6 = saturday
    var dayOffset = [];
    dayOffset.length = 7;

    var today = new Date();
    var resources = [];   
    var durations = []; 
    

    //JS Date object considers Sunday to be the first day of the week.
    //Need to adjust the offset for the start of the week.
    var j = 0;  // we build the second half of the array
    for (var i = weekStart; i < dayOffset.length; i++) {
        dayOffset[i] = j++;
    };
    //Now the first half
    for(var i = 0; i < weekStart; i++) {
        dayOffset[i] = j++;
    };

    //Calculate the date of the first day of the week
    var startDay = new Date();
    startDay.setDate(today.getDate() - dayOffset[today.getDay()]); //This day is the first day of the week to sample from

    var s = new Date();
    var e = new Date();

    // Get the resources for each day of the week!
    for (var i = 0; i < 7; i++) {
        s = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + i);
        e = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + i + 1);

        resources[i] = res.get({start:s.toISOString(), end:e.toISOString()});
    };

    //Get the promise objects.
    var tmp = [];
    for (var i = 0; i < resources.length; i++) {
        tmp[i] = resources[i].$promise;
    };

    $scope.dayArray = [];
    //When those promise objects are done, update the durations array.
    $q.all(tmp).then(function(val){
        for (var i = 0; i < val.length; i++) {
            
            console.log(val[i].objects);
            
             /**           
            for (var i = 0; i < val[i].length; i++) {
                durations[i] = 0;
                console.log("arse " + val[i].objects);

                for (var j = 0; j < val[i].objects.length; j++) {
                    console.log("arse: " + j);
                    //durations[i] = durations[i] + calcDuration($scope.dayArray[i].checkedIn, $scope.dayArray[i].checkedOut);
                };

            };*/


        };
    });




    


    /** calcDuration
    *   Takes a starttime and endtime, formats them as Date objects and returns the 
    *   duration in Milliseconds.
    */
    function calcDuration(starttime, endtime){
      var start = new Date(starttime);
      var end = new Date(endtime);
        console.log(start + " ============= " + end);

      var difference_ms = end - start;

/**
      difference_ms = difference_ms/1000;
      var seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60;
      var minutes = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60;
      var hours = Math.floor(difference_ms);

      scope.duration = hours +  ":" + minutes + ":" + seconds;
*/

        return difference_ms;
    }




    $scope.stuff = today.getDay();
    $scope.junk = dayOffset;
    $scope.crap = startDay;
    $scope.durations = durations;

    $scope.header = "This Week";


    

}]);


/**  List Users Controller
*   Quick debug page to show a list of users
*
*/
app.controller('ListUsersController', ['$scope', 'UserList', function($scope, UserList){
    var theData = UserList.getList();
    $scope.junk = theData;

}]);


app.controller('MyStateController', ['$scope', 'TimerService', function($scope, TimerService){
    TimerService.init();
    $scope.myState = TimerService;

    $scope.start = TimerService.start;
    $scope.stop = TimerService.stop;


    $scope.update = function(){
        console.log(JSON.stringify(TimerService.state))
    }


    $scope.eatit = "";
}]);




app.controller('TimeTestingController', ['$scope', function($scope){
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
    }

}]);
