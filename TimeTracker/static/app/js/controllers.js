app.controller('MainController', ['$scope', 'MyState', function($scope, MyState){
    var statePromise = "";


    /**
     * Get the updated State and Set the scope variables
     */

    $scope.update = function(){
        statePromise = MyState.update();

        statePromise.$promise.then(function(result){
            $scope.state = statePromise.state;
            $scope.chkIn = statePromise.checkedIn;
            $scope.chkOut = statePromise.checkedOut;

            $scope.myState = statePromise;
        });

    }

    $scope.update();

}]);


app.controller('ListUsersController', ['$scope', 'UserList', function($scope, UserList){
    var theData = UserList.getList();
    $scope.junk = theData;

}]);


app.controller('MyStateController', ['$scope', 'MyState', function($scope, MyState){
    var theData = MyState.getCurrentState();
    $scope.junk = theData;
    $scope.eatit = theData.checkedIn
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
