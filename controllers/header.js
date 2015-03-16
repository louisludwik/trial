'use strict';

angular.module('gleepostweb').controller('HeaderCtrl', ['$scope', '$rootScope', 'notifications', 'messages','$cookieStore',
    function($scope, $rootScope, notifications, messages,$cookieStore) {

        $scope.loading=false;
        $scope.notifications = [];
        $scope.liveNotifications=[];
        var getNotifications = function() {
            if($scope.liveNotifications.length<1)
                $scope.loading=true;
            notifications.getNotifications({
                "include_seen": true
            }, function(response) {
                $scope.notifications = [];
                $scope.notifications = response;
                $scope.liveNotifications=[];
                for(var i=0;i<3;i++){
                    $scope.liveNotifications.push(response[i]);
                }
                $rootScope.notification = [];
                $scope.loading=false;
                $scope.$apply();
            }, function(error) {
                $scope.loading=false;
                console.log(error);
            });
        };
        getNotifications();
        $scope.updateNotifications=function(){
            $rootScope.$broadcast('newNotificationReceived', $rootScope.notification);
        };
        $scope.updateMessages=function(){
            $rootScope.$broadcast('newMessageReceived', $rootScope.newMessage);
        };
        $scope.$on('newNotificationReceived', function(event, data) {
            getNotifications();
        });
        $scope.$on('clearNotifications', function(event, data) {
            $scope.notifications = [];
            $scope.$apply();
        });
        $scope.liveMessages = [];
        var getLiveMessages = function() {
            if($scope.liveMessages.length<1)
                $scope.loading=true;
            messages.getLiveConversation({}, function(response) {
                $scope.liveMessages = [];
                for(var i=0;i<3;i++){
                    var conv=[];
                    conv['id'] = response[i].id;
                    conv['lastMessageText'] = response[i].mostRecentMessage ? S(response[i].mostRecentMessage.text).truncate(36).s : '';
                    conv['lastMessageBy'] = response[i].mostRecentMessage ? response[i].mostRecentMessage.by : null;
                    conv['lastActivity'] = response[i].lastActivity;
                    var participants = response[i].participants;
                    conv['participants'] = participants;
                    var participantsNames = '';
                    for (var j = 0; j < participants.length; j++) {
                        if (participants[j].id != $cookieStore.get('user').id)
                            participantsNames += (participants[j].name + ', ');
                    }
                    conv['participantsNames'] = participantsNames.substr(0, participantsNames.length - 2);
                    conv['otherManPic']=participants[0].id == ($cookieStore.get('user').id) ? participants[1].profile_image : participants[0].profile_image;
                    conv['title'] = (participants.length > 2) ? 'Group Chat' : conv['participantsNames'];
                    conv['data'] = response[i];
                    $scope.liveMessages.push(conv);
                }
                $scope.loading=false;
                $scope.$apply();
            }, function(error) {
                $scope.loading=false;
                console.log(error);
            });
        };
        getLiveMessages();
        $scope.$on('newMessageReceived', function(event, data) {
            getLiveMessages();
        });
    }
]);