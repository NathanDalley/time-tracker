var ttService = angular.module('ttService', ['ngResource','ng']);

/** TimerService
 * This service will contain the current known state of the users timer.
 * It will manage any updates that are required and should be treated as a single point of reference for the app
 *
 * Returns:
 *      myState - an object which contains the current state of the current user.  bind to this.
 *      init: init, - Run this to begin with.  Pre populates the myState object
 *      start: start - Start the timer
 *      stop: stop - Stop the timer
 *
 */
ttService.factory('TimerService', ['$resource', '$http', '$timeout', function($resource, $http, $timeout){

    var mystateRes = $resource('/api/v1/mystate/');
    var timeUnit = $resource('/api/v1/timeunit/:id', null,
        {
            'update': {method: 'PUT'}
        }
    );


    var myState = {
        startTime: "",
        endTime: "",
        state: false,  //convenience method
        id: 0
    };


    function updateState(){
        var tmp = mystateRes.get();
        //console.log(tmp);
        tmp.$promise.then(function(){
            myState.startTime = tmp.objects[0].checkedIn;
            myState.endTime = tmp.objects[0].checkedOut;
            myState.state = tmp.objects[0].state;
            myState.id = tmp.objects[0].id;
        },
        function(){
            console.log("fail");
        },
        function(){
            console.log("tick");
        });

        return tmp;
    }

    /** _start
     *  Tells the server to 'start' the timer on the server.
     *
     *  In this case it creates a new TimeUnit object with the current start date
     *  and posts it to the REST service
     *
     *  returns a boolean to signal success or failure
     *  This allows us to update the controller/view accordingly
     *
     * @returns {boolean}
     * @private
     */
    function _start(){
        var tmp = new timeUnit();
        tmp.startTime = new Date();
        tmp.$save({}, function(res){
            return true; // If function reports a success
        },function(res){
            return false; // If it reports an error
        });

        return tmp;
    }

    /** _stop
     * Tells the server to 'stop' the timer.
     * It does this by getting the current state object and setting an End time
     *
     * Returns a boolean to signal that it was successful or failure.
     * This allows us to update the controller/view accordingly
     *
     * @returns {boolean}
     * @private
     */
    function _stop(){
        var tmp = false;

        if(myState.id != 0 && myState.state === true){
            tmp = timeUnit.get({id: myState.id});
            tmp.checkedOut = new Date();
            timeUnit.update({id: myState.id}, tmp,
                function(res){
                    return true; // If function reports a success
                },function(res){
                    return false; // If it reports an error
                }
            );

        }
        else{
            console.log("State not Initialized");
        }

        return tmp;

    }

    /** _getNewState
     *  This function takes an object in the form of myState and keeps running updateState until myState is different
     *  from the previous state.
     *
     *  NOTE: If you give it a reference to myState, it will never be different
     *  try this:
     *  var previousState = JSON.parse(JSON.stringify(myState));
     *
     * @param previousState
     * @private
     */
    function _getNewState(previousState){
        var t = $timeout(function(){
            updateState();  //Get the state
            _getNewState(previousState); // Get it again!
        }, 500); // In 500 milliseconds!

        //compare to new state.  Has it changed? Yes?  Great!  Cancel the timeout object!
        if((previousState.id != myState.id) || (previousState.state != myState.state) ){
            $timeout.cancel(t); // its different.  call off the loop!
        }

    }


    var start = function(){

        var tmp = updateState();
            tmp.$promise.finally(function(){
            if(myState.state===false){
                //get the previous state.  must be a copy, not a reference
                var previousState = JSON.parse(JSON.stringify(myState));
                if(_start()){
                    _getNewState(previousState);
                }
                else{
                    //_start reports an Error
                    console.log("Error in _Start");
                }
            }
            else{
                console.log("Already Started");
            }
        });
    };

    var stop = function(){
        updateState().$promise.finally(function(){
            if(myState.state===true){
                //get the previous sate
                var previousState = JSON.parse(JSON.stringify(myState));
                if(_stop()){ // if _stop was successful
                    _getNewState(previousState);
                }
                else{
                    console.log("Error in _stop");
                }
            }
            else{
                console.log("Already Stopped, you can't Stop this!");
            }

        });
    };

    var init = function(){
        updateState().$promise.finally(function(){
            console.log("Init");
        });
    };

    return{
        state: myState,
        init: init,
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

