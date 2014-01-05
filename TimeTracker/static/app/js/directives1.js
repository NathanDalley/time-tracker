  /**
  *   converts a given time unit into a presentable format
  *   IE.  milliseconds into blah.
  */
  app.directive('duration', function(){
    return{
      restrict : 'E',
      scope : {
        array : '='
      },
      template : '{{duration}}',
      link : link
    }

    function link(scope, el, attrs){
       // console.log(scope.array);
      calculateDuration(scope, el);

      scope.$watch('array.time', function(newval,  oldval){
        calculateDuration(scope, el);
      });        
    }

    function calculateDuration(scope, el){
      var difference_ms = scope.array.time;

      if(scope.array.time !== null){
        difference_ms = difference_ms/1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var hours = Math.floor(difference_ms);

        //scope.duration = hours +  ":" + minutes + ":" + seconds;
        el.text(hours +  ":" + minutes + ":" + seconds);
      }
      else{
        //scope.duration = "No hours this day"
        el.html('<span class="nohours">No hours this day</span>');
      }      
    }
  });

  app.directive('timeObject', function(){

    return {
        restrict : 'E',
        scope : {
          timeUnit : '='
        },
        //template : 'Start: {{startTime}} End: {{endTime}} Duration {{duration}}',
        templateUrl : '/static/app/templates/timeunitobject.html',
        link : link
    }

    function link(scope, element, attrs){
      
      if(scope.timeUnit.checkedOut !== null){
        var start = new Date(scope.timeUnit.checkedIn);
        var end = new Date(scope.timeUnit.checkedOut);

        //debugger;

        scope.startTime = start.toLocaleTimeString();
        scope.endTime = end.toLocaleTimeString();
        

        var difference_ms = end - start;

        difference_ms = difference_ms/1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var hours = Math.floor(difference_ms);

        scope.duration = hours +  ":" + minutes + ":" + seconds;
      }
      else{
        scope.startTime = (new Date(scope.timeUnit.checkedIn)).toLocaleTimeString();;
        scope.endTime = 'Active';
        scope.duration = "00:00:00";
      }

    }


  });


  app.directive('newTimer', function($timeout, dateFilter) {

    return {
        restrict : 'E',
        scope : {
            startTime : '@',
            endTime : '@',
            state : '@'
        },
        link : link
    };


    function link(scope, element, attrs) {
                  //var format = "HH:MM:ss"  // date format
                  var timeoutId; // timeoutId, so that we can cancel the time updates
                  var startTime;
                  var endTime;
                  var state = false;

                  attrs.$observe('startTime', function(value) {
                      startTime = new Date(value);
                      updateTime();
                  });

                  attrs.$observe('endTime', function(value) {
                      endTime = new Date(value);
                      updateTime();
                  });

                  attrs.$observe('state', function(value) {
                      state = (value === 'true');
                      //console.log("State:" + state);
                      if(state){
                          updateLater();
                      }
                      else {
                          $timeout.cancel(timeoutId);
                          updateTime();
                      }

                  });


                  // used to update the UI
                  function updateTime() {
                      var now, then, seconds, minutes, hours, difference_ms ;

                        if(state){ //Timer is on
                          now = new Date();
                          then = new Date(startTime);
                        }
                        else{  //Timer is off
                          now = new Date(endTime);
                          then = new Date(startTime);

                        }

                        //Now calculate the diffence between the two times and break it down!
                        difference_ms = now - then;

                        difference_ms = difference_ms/1000;
                        seconds = Math.floor(difference_ms % 60);
                        difference_ms = difference_ms/60;
                        minutes = Math.floor(difference_ms % 60);
                        difference_ms = difference_ms/60;
                        hours = Math.floor(difference_ms);
                        
                        // Present it!
                        if(!isNaN(difference_ms)){
                          element.html(hours +  ":" + minutes + ":" + seconds);
                        }
                        else{
                          element.html("0:00:00");
                        }

                  }

                  // schedule update in one second
                  function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                      updateTime(); // update DOM
                      updateLater();
                    }, 1000);
                  }

                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time ofter the DOM element was removed.
                  element.bind('$destroy', function(timeoutId) {
                    $timeout.cancel(timeoutId);
                  });

                  updateLater(); // kick off the UI update process.
    };

  });
