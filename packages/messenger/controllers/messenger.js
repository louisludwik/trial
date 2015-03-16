'use strict';
angular.module('gleepostweb.messenger')
    .controller('conversationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'messenger', '$interval', '$cookieStore', '$filter', '$timeout','$stateParams','twemoji',
        function($scope, $rootScope, $http, $location, messenger, $interval, $cookieStore, $filter, $timeout,$stateParams,twemoji) {
            $scope.conversationId=$stateParams.Id;
            $scope.$on('newMessageReceived',function(event,messages){
                console.log("I am getting it");
                for (var i = 0; i < messages.length; i++) {
                        var message = String(messages[i].location);
                        var conId = message.replace('/conversations/', '');
                        var convers = _.findWhere($scope.listOfConversation, {
                            'id': Number(conId)
                        });
                        var newMessage = {};
                        newMessage['id'] = messages[i].data.id;
                        newMessage['text'] = messages[i].data.text;
                        newMessage['by'] = messages[i].data.by;
                        newMessage['isSeen'] = false;
                        newMessage['time'] = new Date(messages[i].data.timestamp).toISOString();
                        newMessage['isMine'] = (messages[i].data.by.id == $cookieStore.get('user').id) ? true : false;
                        newMessage['data'] = messages[i].data;
                        newMessage['group'] = getDate(messages[i].data.timestamp).toISOString();
                        if (!_.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })) {
                            if(convers['messages'])
                                convers['messages'].push(newMessage);
                        }
                        if (_.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })) {
                            _.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })["data"] = messages[i].data;
                        }
                        convers['lastActivity'] = messages[i].data.timestamp;
                        convers['lastMessageText'] = messages[i].data.text;
                        convers['unread'] = convers['unread'] + 1;
                    };
                    //$rootScope.$apply();
                    groupMessages(false);
                    //$scope.$$phase || $scope.$apply();
                    //$scope.$apply();
                    //groupMessages(true);
                    if($scope.selectedConversation){
                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope['newMessage'] = [];
                            })
                        })
                        $scope.selectedConversation.unread=0;
                    }
            })
            $scope.listOfConversation = [];
            $scope.selectedConversation = null;
            $scope.user = {};
            $scope.newMessage = '';
            $scope.$on('newReadReceived',function(event,reads){
                if (reads.length > 0) {
                    $timeout(function() {
                        $scope.$apply(function() {
                            for (var i = 0; i < reads.length; i++) {
                                if (reads[i].data.user != $cookieStore.get('user').id) {
                                    var message = String(reads[i].location);
                                    var conId = message.replace('/conversations/', '');
                                    var convers = _.findWhere($scope.listOfConversation, {
                                        'id': Number(conId)
                                    });
                                    var seenMessage = _.findWhere(convers['messages'], {
                                        'id': reads[i].data.last_read
                                    });
                                    if (seenMessage) {
                                        seenMessage['isSeen'] = true;
                                        seenMessage['lastSeenBy'] = reads[i].data.user
                                    }
                                }
                            };
                            $rootScope['newRead'] = [];
                        });
                    })
                    $("#messages").animate({
                        scrollTop: $('#messages')[0].scrollHeight
                    }, 1000);
                }
            })
            $scope.lastSeenMessgeID=0;
            $scope.markSeen = function(conversationId, MessageId) {
                if(MessageId!=$scope.lastSeenMessgeID)
                {
                    messenger.markSeenMessagesInConversation(conversationId, {
                        'seen': MessageId
                    }, function(response) {
                        _.findWhere($scope.listOfConversation, {
                            'id': conversationId
                        })['unread'] = 0;
                        $scope.lastSeenMessgeID=MessageId;
                    }, function() {
                        console.log("Error");
                    })
                }
            }
            $scope.scrollPositionOfMessages = $('#messages').scrollTop();
            $scope.scrollPositionOfConversations = $('#conversations').scrollTop();
            $scope.$watch('scrollPositionOfMessages', function(newValue, oldValue) {
                if (newValue == 0 && $scope.selectedConversation && $scope.selectedConversation.messages) {
                    $scope.getMessagesForConversation($scope.selectedConversation, {
                        'start': $scope.selectedConversation.messages.length
                    }, false,$scope.selectedConversation.messages[$scope.selectedConversation.messages.length-1].id)
                }
                var trueDivHeight = $('#messages')[0].scrollHeight;
                var divHeight = $('#messages').height();
                var scrollLeft = trueDivHeight - divHeight;
                if (newValue == scrollLeft && $scope.selectedConversation && $scope.selectedConversation['messages']) {
                    var temp = $filter('orderBy')($scope.selectedConversation['messages'], 'data.timestamp')[$scope.selectedConversation['messages'].length - 1];
                    $scope.selectedConversation['unread'] = 0;
                    $scope.markSeen($scope.selectedConversation.id, temp.id)
                }
            });
            $scope.$watch('scrollPositionOfConversations', function(newValue, oldValue) {
                var trueDivHeight = $('#conversations')[0].scrollHeight;
                var divHeight = $('#conversations').height();
                var scrollLeft = trueDivHeight - divHeight;
                if (newValue == scrollLeft && $scope.listOfConversation) {
                    $scope.retrieveConversations({
                        'start': $scope.listOfConversation.length
                    }, false, false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }
            });
            $scope.sendNewMessage = function() {
                if($scope.isNewMessage==true){
                    if ($scope.newMessage != ''&&$scope.addedUsers.length>0){
                        console.log('Sending Message for new conversation');
                        var params={'random':false};
                        var parti='';
                        for(var i=0;i<$scope.addedUsers.length;i++){
                            parti+=String($scope.addedUsers[i].id);
                            parti+=',';
                        }
                        parti = parti.substring(0, parti.length - 1);
                        params['participants']=parti;
                        messenger.addConversation(params,function(response){
                            var conv = {};
                            conv['id'] = response.id;
                            conv['lastMessageText'] = response.mostRecentMessage ? S(response.mostRecentMessage.text).truncate(36).s : '';
                            conv['lastMessageBy'] = response.mostRecentMessage ? response.mostRecentMessage.by : null;
                            conv['lastActivity'] = response.lastActivity;
                            var participants = response.participants;
                            conv['participants'] = participants;
                            var participantsNames = '';
                            for (var j = 0; j < participants.length; j++) {
                                if (participants[j].id != $cookieStore.get('user').id)
                                    participantsNames += (participants[j].name + ', ');
                            }
                            conv['participantsNames'] = participantsNames.substr(0, participantsNames.length - 2);
                            conv['otherManPic']=participants.id == ($cookieStore.get('user').id) ? participants[1].profile_image : participants[0].profile_image;
                            conv['title'] = (participants.length > 2) ? 'Group Chat' : conv['participantsNames'];
                            conv['data'] = response;
                            conv['unread'] = 0;
                            conv['isSelected'] = false;
                            if (!_.findWhere($scope.listOfConversation, {
                                    'id': conv.id
                                })) {
                                $scope.listOfConversation.push(conv);
                                $scope.selectConversation(conv);
                                if ($scope.newMessage != '' && $scope.selectedConversation) {
                                    var conversationId = $scope.selectedConversation.id;
                                    messenger.addMessageToConversation(conversationId, {
                                        'text': $scope.newMessage
                                    }, function(response) {
                                        var message = {};
                                        message['id'] = response.id;
                                        message['text'] = $scope.newMessage;
                                        var user = $cookieStore.get('user')
                                        message['by'] = {
                                            'id': user.id,
                                            'name': user.full_name,
                                            'profile_image': user.profile_image
                                        };
                                        message['isSeen'] = false;
                                        message['time'] = new Date().toISOString();
                                        message['isMine'] = true;
                                        message['group'] = getDate(new Date()).toISOString();
                                        if (!_.findWhere($scope.selectedConversation["messages"], {
                                                'id': message.id
                                            })) {
                                            ($scope.selectedConversation["messages"]).push(message);
                                            //addToGroup(message);
                                        }
                                        //$scope.getMessagesForConversation($scope.selectedConversation, null, true);
                                        _.findWhere($scope.listOfConversation, {
                                            'id': $scope.selectedConversation.id
                                        })['lastActivity'] = new Date().toISOString();
                                        _.findWhere($scope.listOfConversation, {
                                            'id': $scope.selectedConversation.id
                                        })['lastMessageText'] = $scope.newMessage;
                                        $scope.newMessage = '';
                                        groupMessages(true);
                                    }, function() {
                                        console.log("Error Occured");
                                    });
                                } else
                                    console.log("can't send message")
                            }

                        },function(err){
                            console.log("Error: ",err);
                        });
                    }
                    else{
                        console.log('Message length should be more than 1')
                    }
                }
                else{
                    if ($scope.newMessage != '' && $scope.selectedConversation) {
                        var conversationId = $scope.selectedConversation.id;
                        messenger.addMessageToConversation(conversationId, {
                            'text': $scope.newMessage
                        }, function(response) {
                            var message = {};
                            message['id'] = response.id;
                            message['text'] = $scope.newMessage;
                            var user = $cookieStore.get('user')
                            message['by'] = {
                                'id': user.id,
                                'name': user.full_name,
                                'profile_image': user.profile_image
                            };
                            message['isSeen'] = false;
                            message['time'] = new Date().toISOString();
                            message['isMine'] = true;
                            message['group'] = getDate(new Date()).toISOString();
                            if (!_.findWhere($scope.selectedConversation["messages"], {
                                    'id': message.id
                                })) {
                                ($scope.selectedConversation["messages"]).push(message);
                                //addToGroup(message);
                            }
                            //$scope.getMessagesForConversation($scope.selectedConversation, null, true);
                            _.findWhere($scope.listOfConversation, {
                                'id': $scope.selectedConversation.id
                            })['lastActivity'] = new Date().toISOString();
                            _.findWhere($scope.listOfConversation, {
                                'id': $scope.selectedConversation.id
                            })['lastMessageText'] = $scope.newMessage;
                            $scope.newMessage = '';
                            groupMessages(true);
                        }, function() {
                            console.log("Error Occured");
                        });
                    } else
                        console.log("can't send message")
                }
            };
            $scope.groups = []
            var groupMessages = function(isScroll,previousMessageId) {

                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.selectedConversation["groupMessages"]=null;
                        $scope.selectedConversation["groupMessages"] = _.groupBy($scope.selectedConversation["messages"], 'group')

                        for (var key in $scope.selectedConversation["groupMessages"]) {
                            //$scope.selectedConversation["groupMessages"][key]=$filter('orderBy')($scope.selectedConversation["groupMessages"][key], "time",false);
                            _.sortBy($scope.selectedConversation["groupMessages"][key], function(o) { return o.time; }).reverse();
                        }
                        console.log("sorting done");
                    })
                    if (isScroll)
                        if($("#messages")&&$('#messages')[0])
                        {
                            $("#messages").animate({
                                    scrollTop: $('#messages')[0].scrollHeight
                                }, 1);
                        }
                })
                /*setTimeout(function(){
                    console.log('hello');
                    if(previousMessageId){
                        console.log(previousMessageId);
                        console.log($scope.selectedConversation["messages"][$scope.selectedConversation.messages.length-1].id);
                        var tt="message_"+previousMessageId;
                        console.log(tt);
                        console.log(document.getElementById(tt));
                        var tty=document.getElementById(tt).scrollTop;
                        console.log(tty)
                        var coffset = document.getElementById("message_"+$scope.selectedConversation["messages"][$scope.selectedConversation.messages.length-1].id).scrollHeight;
                        console.log(coffset)
                        document.getElementById("message_"+previousMessageId).scrollTop += coffset;
                    }
                }, 500)*/
            }
            var getDate = function(timestamp) {
                timestamp = new Date(timestamp);
                return new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate());
            };
            $scope.getMessagesForConversation = function(selected, params, isScroll,previousMessageId) {
                $scope.isPreviousLoading=true;
                var initInjector = angular.injector(['ngCookies']);
                var $cookieStore = initInjector.get('$cookieStore');
                messenger.getMessagesForConversation(selected.id, params, function(response) {
                    for (var i = 0; i < response.length; i++) {
                        var message = {};
                        message['id'] = response[i].id;
                        message['text'] = response[i].text;
                        message['by'] = response[i].by;
                        message['isSeen'] = false;
                        message['time'] = new Date(response[i].timestamp).toISOString();
                        message['isMine'] = (response[i].by.id == $cookieStore.get('user').id) ? true : false;
                        message["data"] = response[i];
                        message['group'] = getDate(response[i].timestamp).toISOString();
                        if (!$scope.selectedConversation["messages"])
                            ($scope.selectedConversation["messages"]) = [];
                        if (!_.findWhere($scope.selectedConversation["messages"], {
                                'id': message.id
                            })) {
                            ($scope.selectedConversation["messages"]).push(message);
                        }
                    }
                    $scope.isPreviousLoading=false;
                    groupMessages(isScroll,previousMessageId);
                    //groupMessages($scope.selectedConversation["messages"]);
                    if (isScroll) {
                        $interval(function() {
                            $scope.scrollPositionOfMessages = $('#messages').scrollTop();
                        }, 50);
                    }
                }, function() {
                    console.log("Error Occured");
                });
            };
            $scope.selectConversation = function(selected) {
                $scope.isNewMessage=false;
                selected.isSelected = true;
                $scope.selectedConversation = selected;
                for (var i = 0; i < $scope.listOfConversation.length; i++) {
                    if ($scope.listOfConversation[i] != selected)
                        $scope.listOfConversation[i].isSelected = false;
                }
                $scope.getMessagesForConversation(selected, null, true);
                selected.unread=0;
                $timeout(function() {
                    $rootScope.$apply(function() {
                        $rootScope['newMessage'] = [];
                    })
                })
                //$("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);
            };
            var getConversationsFn = function() {
                $scope.retrieveConversations(null, true, true);
            };
            $scope.retrieveConversations = function(params, isScroll, IsSelectFirst) {
                messenger.getConversations(params, function(response) {
                    for (var i = 0; i < response.length; i++) {
                        var conv = {};
                        conv['id'] = parseInt(response[i].id);
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
                        conv['unread'] = 0;
                        conv['isSelected'] = false;
                        if (!_.findWhere($scope.listOfConversation, {
                                'id': conv.id
                            })) {
                            $scope.listOfConversation.push(conv);
                        }
                    }
                    $scope.$apply()
                    if (isScroll) {
                        // $("#conversations").animate({ scrollTop: $('#conversations')[0].scrollHeight}, 1000);
                        $interval(function() {
                            $scope.scrollPositionOfConversations = $('#conversations').scrollTop();
                            //console.log($scope.scrollPositionOfConversations);
                        }, 50);
                    }
                    if (IsSelectFirst) {
                        if($scope.conversationId){
                            var conversation=_.findWhere($scope.listOfConversation, {'id': parseInt($scope.conversationId)});
                            if (conversation){
                                $scope.selectConversation(conversation);
                            }
                            else{
                                $scope.selectConversation($scope.listOfConversation[0]);
                            }
                        }
                        else{
                            $scope.selectConversation($scope.listOfConversation[0]);
                        }
                    }
                }, function() {
                    alert("Error Occured");
                });
            };
            // Register the login() function
            getConversationsFn();
            $scope.isNewMessage=false;
            $scope.createNewMessage=function(){
                $scope.isNewMessage=true;
                for(var i=0;i<$scope.listOfConversation.length;i++){
                    $scope.listOfConversation[i].isSelected=false;
                }
                $scope.selectedConversation=[];

            };
            $scope.addedUsers=[];
            $scope.userSelected=function(index){
                $scope.newUserSearch='';
                var isAlready = _.findWhere($scope.addedUsers, {
                    'id': $scope.resultUsers[index].id
                });
                if($scope.resultUsers[index].id&&isAlready==null){
                    $scope.addedUsers.push($scope.resultUsers[index]);
                }
            };
            $scope.removeUser= function (index) {
                $scope.addedUsers.splice(index,1);
            }
            $scope.$watch('newUserSearch', function (tmpStr)
            {
                $scope.resultUsers=[];
                if (!tmpStr || tmpStr.length == 0)
                    return 0;
                // if searchStr is still the same..
                // go ahead and retrieve the data
                if (tmpStr === $scope.newUserSearch&&tmpStr.length>1)
                {
                    messenger.searchForUser(tmpStr,function(response){
                        if(response.length>0){
                            $scope.resultUsers=response;
                        }
                        else{
                            $scope.resultUsers=[];
                            $scope.resultUsers.push({'name':'No result'})
                        }
                    },function(err){
                        console.log("ERROR: "+err)
                    });
                }
            });
        }
    ]);