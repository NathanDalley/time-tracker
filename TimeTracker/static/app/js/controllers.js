/**  Main Page Controller
 *
 */
app.controller('MainController', ['$scope', 'TimerService', function($scope, TimerService){

    TimerService.init();
    $scope.timer = TimerService.state;

    $scope.start = TimerService.start;
    $scope.stop = TimerService.stop;


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
