var ttService = angular.module('ttService', ['ngResource','ng']);

/** TimerService
 * This service will contain the current known state of the users timer.
 * It will manage any updates that are required and should be treated as a single point of reference for the app
 */
ttService.factory('TimerService', ['$resource', '$http', function($resource, $http){

    var mystateRes = $resource('/api/v1/mystate/');
    var timeUnit = $resource('/api/v1/timeunit/:id');

    var myState = {
        startTime: "",
        endTime: "",
        state: false  //convenience method
    };


    function updateState(){
        var tmp = mystateRes.get();
        tmp.$then();
        debugger;
        console.log(JSON.stringify(tmp));

    }




    var start = function(){
        //@TODO: public method which starts the timer.  Should handle errors if cannot start
        updateState();

    };

    var stop = function(){
        //@TODO: public method which stops the timer.  Should handle errors if it cannot stop
    };

    return{
        state: myState,
        start: start,
        stop: stop
    };


}]);












/**
 * Get a particular Time Unit
 */

ttService.factory('TimeUnits', ['$resource','$http',
  function($resource, $http){
    return $resource('/api/v1/timeunit/:thing', {}, {
      getUnits: {
          method:'GET',
          params:{thing:''},
          isArray:true,
          transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    var obj = angular.fromJson(data);
                    var result = obj.objects;
                    result.meta = obj.meta;

                    return result;
                }
          ])
      }
    });
  }]);


/**  Old My State Service.
 * Used to get the state and to toggle the state to off.
 * toggle state will soon be depecrecated on the server end
 *
 */

ttService.factory('MyState', ['$resource','$http',
  function($resource, $http){
    return $resource('/api/v1/mystate/:tuid/', {}, {
      getState: {
          method:'GET',
          isArray:false,
          transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    console.log(data);
                    var obj = angular.fromJson(data);
                    var result = obj.objects;

                    return result[0];
                }
          ])
      },
      toggleState:{
          method:'PUT',
          params: {tuid: '@id'},
          transformRequest: function(obj){
              console.log("1");
              console.log(obj);
              var thing = {};
              //thing.data = obj;
              //thing.data.objects = [obj];
              thing = obj;

              console.log("2");
              console.log(JSON.stringify(thing));
              return JSON.stringify(thing);
          }
      },
      stuff:{
          method: 'PUT'
      }

    });
  }]);



ttService.factory('UserList', ['$resource', '$http',
  function($resource, $http){
    return $resource('/api/v1/user/', {}, {
      getList: {
          method:'GET',
          params:{},
          isArray:true,
          transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    var obj = angular.fromJson(data);
                    var result = obj.objects;
                    result.meta = obj.meta;

                    return result;
                }
          ])
      }
    });
  }]);

