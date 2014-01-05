/**
*
*/
app.controller('LoginController', ['$scope', 'LoginService', function($scope, LoginService){
    $scope.login = LoginService;
    }]);

/**  Main Page Controller
 *
 */
app.controller('MainController', ['$scope', 'LoginService', 'TimerService', function($scope, LoginService, TimerService){
    $scope.login = LoginService;
    $scope.timer = TimerService.state;

    $scope.start = TimerService.start;
    $scope.stop = TimerService.stop;


}]);

/** Today Controller
*   Displays a list of all the Time untis recorded for today
*/
app.controller('TodayController', ['$scope', 'LoginService', '$resource', function($scope, LoginService, $resource){
    $scope.login = LoginService;
    var res = $resource('/api/v1/timeunit/?checkedIn__gte=:start&checkedIn__lte=:end');

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
app.controller('WeekController', ['$scope', '$resource', '$q', 'LoginService', function($scope, $resource, $q, LoginService){
    $scope.login = LoginService;
    //@TODO: Pagination will limit each day to 20 resources!!!1 Fix this
    var res = $resource('/api/v1/timeunit/?checkedIn__gte=:start&checkedIn__lte=:end');
    var dayHeaders = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri','Sat']; //Default Day Headings
    var weekStart = 1; // 0 = sunday, 6 = saturday
    var dayOffset = [];
    dayOffset.length = 7;

    var today = new Date();
    var resources = [];   
    $scope.durations = []; 
    $scope.header = "This Week";
    

    //JS Date object considers Sunday to be the first day of the week.
    //Need to adjust the offset for the start of the week.
    //These for loops will set the headings in the correct location of the durations array
    //and adjust the offset so that we can find the correct date to query from
    var j = 0;  // we build the second half of the array
    for (var i = weekStart; i < dayOffset.length; i++) {
        $scope.durations[j] = {
            day: dayHeaders[i],
            time: 0
        }

        dayOffset[i] = j++;
        //debugger;
    };
    //Now the first half
    for(var i = 0; i < weekStart; i++) {
        $scope.durations[j] = {
            day: dayHeaders[i],
            time: 0
        }
        dayOffset[i] = j++;
    };

    //Calculate the date of the first day of the week
    var startDay = new Date();
    $scope.startDay = startDay;
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

    
    //When those promise objects are done, update the durations array.
    $q.all(tmp).then(function(val){
        var tmp = [];

        for (var i = 0; i < val.length; i++) {
            $scope.durations[i].time = 0;
            tmp = val[i].objects;
            //console.log(tmp);

            if (tmp.length > 0) {
                
                for (var j = 0; j < tmp.length; j++) {
                    //$scope.durations[i] = tmp.length;
                    //console.log(val[i].objects[j]);
                    if(tmp[j].checkedOut !== null)
                    {
                        $scope.durations[i].time = $scope.durations[i].time + calcDuration(tmp[j].checkedIn, tmp[j].checkedOut);
                        
                    }

                };
            }else{
                $scope.durations[i].time = null;
            }

        };
        //console.log($scope.durations);
    });

    /** calcDuration
    *   Takes a starttime and endtime, formats them as Date objects and returns the 
    *   duration in Milliseconds.
    */
    function calcDuration(starttime, endtime){
      var start = new Date(starttime);
      var end = new Date(endtime);

      var difference_ms = end - start;
      return difference_ms;
    }
    

}]);



/**  List Users Controller
*   Quick debug page to show a list of users
*
*/
app.controller('ListUsersController', ['$scope', 'LoginService', 'UserList', function($scope, LoginService, UserList){
    var theData = UserList.getList();
    $scope.junk = theData;
    $scope.login = LoginService;

    $scope.loggedin = LoginService.isLoggedIn();
    $scope.name = LoginService.user.name;

}]);


app.controller('MyStateController', ['$scope', 'TimerService', function($scope, TimerService){
    
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
