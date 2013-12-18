/**  Main Page Controller
 *
 */
app.controller('MainController', ['$scope', 'MyState', function($scope, MyState){
    var statePromise = "";


    /**
     * Get the updated State and Set the scope variables
     */
    $scope.update = function(){
        statePromise = MyState.getState();

        statePromise.$promise.then(function(result){
            $scope.state = statePromise.state;
            $scope.chkIn = statePromise.checkedIn;
            $scope.chkOut = statePromise.checkedOut;

            $scope.myState = statePromise;
            //console.log("Ding");
        });

    }

    $scope.toggleState = function(){

        statePromise.checkedOut = new Date();
        statePromise.$toggleState();

        //TODO. Work out if we need to set a stop time
        //TODO. Work out if we need to create a new TimeUnit

        //$scope.myState.checkedOut = new Date();
        //$scope.myState.save();
    }

    $scope.update();

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
    TimerService.start();
    $scope.junk = "";
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
