'use strict';
angular.module('gleepostweb.notifications')
    .controller('notificationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'notifications',
        function($scope, $rootScope, $http, $location, notifications) {
            // This object will be filled by the form
            $scope.notifications=null;
            var getNotifications = function() {
                notifications.getNotifications({
                    "include_seen" : true
                }, function(response) {
                    console.log(response);
                    $scope.notifications=response;
                    $rootScope.notification=[];
                    $scope.$apply();
                    markNotificationsRead();
                }, function(error) {
                    //alert(error);
                });
            };
            $scope.$on('newNotificationReceived', function(event, data) {
                getNotifications();
            });
            var markNotificationsRead=function(){
                console.log('marking read');
                console.log($scope.notifications[0].id);
                $rootScope.$broadcast('clearNotifications',null);
                notifications.markSeenNotifications({ "seen":$scope.notifications[0].id }, function(response) {
                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
            }
            getNotifications(); //method is invoked when the view loads
           /* $scope.$on('newNotificationReceived',function(event,notification){
                console.log("notification received");
                for (var i = 0; i < notification.length; i++) {
                    $scope.notifications.push(notification[i].data);
                };
                console.log(notification);
                $scope.$apply();
            });*/
        }
    ])