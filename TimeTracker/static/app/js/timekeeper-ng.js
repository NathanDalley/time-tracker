
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
    .when('/Today', {
        controller: 'TodayController',
        templateUrl: 'app/partials/Today.html'
    })
    .when('/Week', {
        controller: 'WeekController',
        templateUrl: 'app/partials/Week.html'
    })

    .otherwise({ redirectTo: '/' });

}]);
