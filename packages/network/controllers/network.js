'use strict';

angular.module('gleepostweb.network')
    .controller('networksCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$timeout',
        function($scope, $rootScope, $http, $location, network,$timeout) {
            $scope.myNetworks=[];
            
            var getNetworks = function() {
                network.getNetworksforUser(null, function(response) {
                    $scope.myNetworks=response;
                    for (var i = 0; i < response.length; i++) {
                         network.getNetwork(response[i].id,null,function(res){
                            if(!res.image)
                                res['image']='assets/images/circle.jpg'
                            console.log(res);
                            network.getNetworkUsers(res.id,null, function(response1) {
                                console.log(response1);
                                res['membersNum']=response1.length;
                                console.log(res);
                                $scope.$apply();
                            }, function(error) {
                                alert(error);
                            });
                            if(!_.findWhere($scope.myNetworks,{'id':res.id}))
                                $scope.myNetworks.push(res);
                            //$scope.$apply();
                        },function(err){
                            console.log(err);
                        })
                    };
                }, function(error) {
                    alert(error);
                });
            };

            getNetworks(); //method is invoked when the view loads
            $scope.searchedNetworks = [];
            $scope.searchForGroup=function(){
                //$timeout(function() {
                //    $scope.$apply(function () {
                        if ($scope.query && $scope.query != "") {
                            network.searchNetwork($scope.query, {'name': $scope.query}, function (response) {
                                for(var i=0;i<response.length;i++){
                                    $scope.searchedNetworks.push(response[i]);
                                }
                                console.log($scope.searchedNetworks)
                            }, function (error) {
                                console.log(error);
                                $scope.searchedNetworks = [];
                            });
                        }
                        else {
                            $scope.searchedNetworks = [];
                        }
                //    });
                //});
            }
            $scope.joinMe=function(network){
                network.joined=true;
            };
            $scope.addNewGroup=function(newGroup){
                network.addNetwork(newGroup, function(response) {
                    console.log(response);
                    location.reload();
                }, function(error) {
                    alert(error);
                });
                
            }
            $scope.showOptions=false;
            $scope.selectedOption='All Groups';
            $scope.toggleOptions=function(){
                if($scope.showOptions==true){
                    $scope.showOptions=false;
                }
                else{
                    $scope.showOptions=true;
                }
            };
            $scope.selectMyGroups=function(){
                $scope.selectedOption='My Groups';
                $scope.showOptions=false;
            };
            $scope.selectSearchedGroups=function(){
                $scope.selectedOption='Search Results';
                $scope.searchForGroup();
                $scope.showOptions=false;
            };
            $scope.selectAllGroups=function(){
                $scope.selectedOption='All Groups';
                $scope.showOptions=false;
            };
        }
    ])
    .controller('networkCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams',
            function($scope, $rootScope, $http, $location, network,$stateParams) {
                $scope.myNetworks=[];
                $scope.networkId=$stateParams.Id;
                $scope.networkDetails={};
                var getNetwork = function() {
                    network.getNetwork($scope.networkId,null, function(response) {
                        $scope.networkDetails=response;
                        $scope.$apply();
                    }, function(error) {
                        alert(error);
                    });
                };

                getNetwork(); //method is invoked when the view loads
            }
        ])
    .controller('networkPostsCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams','$interval',
            function($scope, $rootScope, $http, $location, network,$stateParams,$interval) {
                $scope.myNetworks=[];
                $scope.networkId=$stateParams.Id; window.grpID = $stateParams.Id;
                $scope.campusPosts=[];
                $scope.postText = null;
                $scope.postFile = null;
                $scope.scrollPositionOfPage=$(document).scrollTop();
                $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                    var limit = document.body.offsetHeight - window.innerHeight;
                    if(newValue>limit){
                        getPosts({'start':$scope.campusPosts.length},false);
                        //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                    }
                });
                $scope.addPost = function() {
                    //alert("Post to be added");
                    // util.uploadMedia({

                    // }, function(response){

                    // }, function(error){

                    // });

                    network.addPostToNetwork($scope.networkId,{
                        "text": $scope.postText
                    }, function(response) {
                        console.log(response);
                    }, function(error) {

                    });
                };
                var getPosts=function(params,isScroll){
                    network.getNetworkPosts($scope.networkId,params,function(response){
                        for (var i = 0; i < response.length; i++) {
                            var post={};
                            post['id']=response[i].id;
                            post['by']=response[i].by;
                            post['text']=response[i].text;
                            post['time']=moment(response[i].timestamp).fromNow();
                            post['data']=response[i];
                            post['image']=(response[i].images!=null) ? response[i].images[0]: ((response[i].videos==null)? null:response[i].videos[0].thumbnails[0]);
                            if(!_.findWhere($scope.campusPosts, {'id': post.id})){
                                $scope.campusPosts.push(post);
                            }
                        };
                        $scope.$apply();
                        if(isScroll){
                            $interval(function() {
                                $scope.scrollPositionOfPage=$(document).scrollTop();
                            }, 50);
                        }
                    },function(){
                        console.log("ERROR")
                    })
                };
                getPosts(null,true);

            }
        ])
.controller('networkMembersCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams',
            function($scope, $rootScope, $http, $location, network,$stateParams) {
                $scope.networkId=$stateParams.Id;
                console.log($scope.networkId);
                $scope.networkMembers={};
                var getNetworkUsers = function() {
                    network.getNetworkUsers($scope.networkId,null, function(response) {
                        network.getAllAdminsInNetwork($scope.networkId,function(res){
                            for(var i=0;i<response.length;i++){
                                if(_.findWhere(res, {'id': response[i].id})){
                                    response[i].isAdmin=true;
                                }
                                else{
                                    response[i].isAdmin=false;
                                }
                            }
                            $scope.networkMembers=response;
                        },function(err){
                            console.log("Error: ",err)
                        });
                        console.log($scope.networkMembers);
                        $scope.$apply();
                    }, function(error) {
                        alert(error);
                    });
                };

                getNetworkUsers(); //method is invoked when the view loads
                $scope.makeAdmin=function(Index){
                    network.makeAdminInNetwork($scope.networkId,{'users':$scope.networkMembers[Index].id},function(res){
                        console.log(res);
                        getNetworkUsers();
                    },function(err){
                        console.log("Error: ",err)
                    });
                };
                $scope.removeAdmin=function(Index){
                    network.removeAdminInNetwork($scope.networkId,$scope.networkMembers[Index].id,function(res){
                        console.log(res);
                        getNetworkUsers();
                    },function(err){
                        console.log("Error: ",err)
                    });
                };
                $scope.removeMember=function(index){

                };
            }
        ])
    .controller('networkSettingsCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams',
        function($scope, $rootScope, $http, $location, network,$stateParams) {
            $scope.networkId=$stateParams.Id;
            $scope.networkDetails={};
            var getNetwork = function() {
                network.getNetwork($scope.networkId,null, function(response) {
                    $scope.networkDetails=response;
                    console.log($scope.networkDetails);
                    $scope.$apply();
                }, function(error) {
                    alert(error);
                });
            };

            getNetwork(); //method is invoked when the view loads
            $scope.SaveChanges=function(){
                console.log("here");
                var parti='';
                if($scope.addedUsers.length>0){
                    for(var i=0;i<$scope.addedUsers.length;i++){
                        parti+=String($scope.addedUsers[i].id);
                        parti+=',';
                    }
                    parti = parti.substring(0, parti.length - 1);
                    console.log(parti);
                    network.addUserToNetwork($scope.networkId,{'users':parti}, function (response) {
                        console.log(response);
                    },function(err){
                        console.log("Error: ",err);
                        alert(err.error);
                    });
                }
                network.updateNetwork($scope.networkId,{'name':$scope.networkDetails.name,'description':$scope.networkDetails.description},function(res){
                    console.log(res);
                    consoel.log("Successfully saved")
                },function(err){
                    console.log("Error: ",err);
                });

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
                console.log(tmpStr);
                $scope.resultUsers=[];
                if (!tmpStr || tmpStr.length == 0)
                    return 0;
                // if searchStr is still the same..
                // go ahead and retrieve the data
                if (tmpStr === $scope.newUserSearch&&tmpStr.length>1)
                {
                    network.searchForUser(tmpStr,function(response){
                        if(response.length>0){
                            $scope.resultUsers=response;
                            console.log($scope.resultUsers);
                            $scope.$apply();
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