var ttService = angular.module('ttService', ['ngResource','ng']);



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

/**
ttService.factory('MyState', ['$resource','$http',
  function($resource, $http){

     var myState ="";

     var update = function(){
         return $resource('/api/v1/mystate/', {}, {
              update: {
                  method:'GET',
                  params:{},
                  isArray:false,
                  transformResponse: $http.defaults.transformResponse.concat([
                        function (data, headersGetter) {
                            var obj = angular.fromJson(data);
                            var result = obj.objects;
                            console.log(result);

                            myState = result[0];
                            console.log("STATE:" + myState);
                            return myState;
                        }
                  ])
              }

         });
     }

     return {
         myState: myState,
         update: update
     }


  }]);*/



ttService.factory('MyState', ['$resource','$http',
  function($resource, $http){
    return $resource('/api/v1/mystate/', {}, {
      update: {
          method:'GET',
          params:{},
          isArray:false,
          transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    var obj = angular.fromJson(data);
                    var result = obj.objects;

                    return result[0];
                }
          ])
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

