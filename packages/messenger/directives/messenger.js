'use strict';
angular.module('gleepostweb.messenger')
  .directive("keepScroll", function(){
    console.log('in directive')
    return {
      controller : function($scope){
        var element = null;
        this.setElement = function(el){
          element = el;
        }
        this.addItem = function(item){
          element.scrollTop = (element.scrollTop+item.clientHeight+1);
         //1px for margin from your css (surely it would be possible
         // to make it more generic, rather then hard-coding the value)
        };
      },
      link : function(scope,el,attr, ctrl) {
       ctrl.setElement(el[0]);
      }
    };
  })
  .directive("scrollItem", function(){
    return{
      require : "^keepScroll",
      link : function(scope, el, att, scrCtrl){
        scrCtrl.addItem(el[0]);
      }
    }
  })

.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })