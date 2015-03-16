'use strict';
angular.module('gleepostweb.campusWall')
    .controller('wallCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval','$state',
        function($scope, $rootScope, $http, $location, wall,$interval,$state) {
            $scope.createFocused=false;
            $scope.showClosebtn = false;

            $scope.currentPostTab = null;

            $scope.focusCreatePost=function(){
                $scope.createFocused=true;
                $scope.showClosebtn = true;
                $scope.currentPostTab = 'announcement';
                $state.go('wall.announcement')
                $("#txtAnnouncement").focus();
            };

            $scope.goToAnnouncement = function(){
                $scope.createFocused=true;
                $scope.showClosebtn = true;
                $scope.currentPostTab = 'announcement';
                $state.go('wall.announcement')
                $("#txtAnnouncement").focus();
            };

            $scope.goToEvent = function(){
                $scope.createFocused=true;
                $scope.showClosebtn = true;
                $scope.currentPostTab = 'event';
                $state.go('wall.event.calendar')
            };

            $scope.goToGeneral = function(){
                $scope.createFocused=true;
                $scope.showClosebtn = true;
                $scope.currentPostTab = 'general';
                $state.go('wall.generalPost')
            };

            $scope.btnClosePost = function(){
                $scope.createFocused=false;
                $scope.showClosebtn = false;
                $scope.currentPostTab = null;
                $state.go('wall')
            };

            $scope.uploadMyFile=function(file){
              wall.uploadFile(file,null,function(res){
                console.log(res);
               // cb();
              },function(err){
                console.log(err);
              })
            }
            $scope.tryshowme=function(){
                console.log($scope.file);
                $scope.uploadMyFile($scope.file[0]);
            }
            var injector = angular.injector(['gleepostweb.utilities']);
            var util = injector.get('util');

            window.globalVar = "Nadeem";
            
            $scope.campusPosts=[];
            $scope.scrollPositionOfPage=$(document).scrollTop();
            $scope.postText = null;
            $scope.postFile = null;
            $scope.category='allposts';
            $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                var limit = document.body.offsetHeight - window.innerHeight;
                if(newValue>limit){
                    if($scope.category=='allposts')
                        getPosts({'start':$scope.campusPosts.length},false);
                    else if($scope.category=='music')
                        getPosts({'start':$scope.campusPosts.length,'filter':'music'},false);
                    else if($scope.category=='theater')
                        getPosts({'start':$scope.campusPosts.length,'filter':'theater'},false);
                    else if($scope.category=='sports')
                        getPosts({'start':$scope.campusPosts.length,'filter':'sports'},false);
                    else if($scope.category=='party')
                        getPosts({'start':$scope.campusPosts.length,'filter':'party'},false);
                    else if($scope.category=='speaker')
                        getPosts({'start':$scope.campusPosts.length,'filter':'speaker'},false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }
            });

            $scope.showComments = function($index, $event){
                //console.log($scope.campusPosts[$index]);
                var postID = $scope.campusPosts[$index].id;
                if($scope.campusPosts[$index].comments){
                    angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page').fadeToggle();
                }
                else{
                    $scope.campusPosts[$index].comments = [];
                    wall.getCommentsForPost(postID, null, function(response){
                        //function success
                        console.log(response)
                        for(var i = 0 ; i < response.length; i++){
                            var tmp = {};
                            tmp.profileImage = response[i].by.profile_image;
                            tmp.name = response[i].by.name;
                            tmp.txt = response[i].text;

                            $scope.campusPosts[$index].comments.push(tmp)
                        }
                       // $scope.campusPosts[$index].comments=response;
                       $scope.campusPosts[$index].comments.reverse();
                        $scope.$apply();
                        angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page').fadeToggle();
                        $scope.$apply();
                    }, function(){
                        //function error
                    });
                }

            };

            $scope.addComment = function($index , $event, txtComment){
               var postID = $scope.campusPosts[$index].id;
               wall.addCommentForPost(postID, {text: txtComment}, function(response){
                    console.log(response)
                    $scope.campusPosts[$index].commentCount++;
                    if($scope.campusPosts[$index].comments){
                      // var commentsContainer = angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page')
                      // commentsContainer.append('<div  class="show-commnets"> <a href="javascript:void(0)" class="use-comment-image"> <img src="' + window.UserImage+ '"> </a> <p class="user-comment-name ng-binding">'+ window.UserName +'</p> <p class="floatLeft msg ng-binding">' + txtComment+ '</p> </div>')
                       var tmp = {};
                            tmp.profileImage = window.UserImage;
                            tmp.name = window.UserName;
                            tmp.txt = txtComment;

                            $scope.campusPosts[$index].comments.push(tmp)

                    }

               }, function(){

               }); 
            };

            $scope.addPost = function(){
                //alert("Post to be added");
                // util.uploadMedia({

                // }, function(response){

                // }, function(error){

                // });

                wall.addPost({
                   "text": $scope.postText 
                },function(response){
                    console.log(response);
                }, function(error){

                });
            };
            var enableOthers=function(me){
                $('#'+me).attr('disabled','disabled');
                for (var i = categories.length - 1; i >= 0; i--) {
                    if(categories[i]!=me)
                        $('#'+categories[i]).removeAttr('disabled');
                };
            }
            var categories=['party','music','sports','theater','speaker','allposts']
            $scope.PartyClicked=function(){
                $scope.category='party'
                $scope.campusPosts=[];
                getPosts({'filter':'party'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.MusicClicked=function(){
                $scope.category='music'
                $scope.campusPosts=[];
                getPosts({'filter':'music'},true);
              //  console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.SportsClicked=function(){
                $scope.category='sports'
                $scope.campusPosts=[];
                getPosts({'filter':'sports'},true);
              //  console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.TheaterClicked=function(){
                $scope.category='theater'
                $scope.campusPosts=[];
                getPosts({'filter':'theater'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.SpeakerClicked=function(){
                $scope.category='speaker'
                $scope.campusPosts=[];
                getPosts({'filter':'speaker'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.AllPostsClicked=function(){
                $scope.category='allposts';
                $scope.campusPosts=[];
                getPosts(null,true);
                //console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.setFiles = function(file){
                  //   console.log(file);
                  // $scope.$apply(function(scope) {
                  // console.log('files:', element.files);
                  // // Turn the FileList object into an Array
                  // //   scope.files = []
                  // //   for (var i = 0; i < element.files.length; i++) {
                  // //     scope.files.push(element.files[i])
                  // //   }
                  // // scope.progressVisible = false
                  // });
            };

            var getPosts=function(params,isScroll){
                wall.getPosts(params,function(response){
                        console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        var post={};
                        post['id']=response[i].id;
                        post['by']=response[i].by;
                        post['text']=response[i].text;
                        post['time']=moment(response[i].timestamp).fromNow();
                        post['data']=response[i];
                        post['commentCount'] = response[i].comment_count;
                        post['likesCount'] =  response[i].like_count;
                        //console.log(typeof(_.has(response[i], 'videos')))

                        if(_.has(response[i], 'videos') === true){
                        //if (typeof(response[i].videos) !== 'undefined'){
                            //alert("inside If");
                            post["video"] = true;
                            post["mp4"] = response[i].videos[0].mp4;
                            post["webm"] = response[i].videos[0].webm;
                        }
                        else{
                            //alert("inside else")
                            post["video"] = false;
                        }
                        post["video"] = "false";
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
            $scope.postClicked=function(id){
                console.log('clicked');
                $('#modal-outer').show();
                $('#wallPage').hide();
                $(".fancypopover, .popover-mask, #modal-close").toggleClass("active");
                $state.go('wall.post', { 'Id' : id });
            }
            $scope.closePostView=function(){
                $('#modal-outer').hide();
                $('#wallPage').show();
                $(".fancypopover, .popover-mask, #modal-close").toggleClass("active");
                $state.go('wall');
            }
            $("#modal-launcher, .popover-mask, #modal-close").click(function() {
                $('#modal-outer').hide();
                $('#wallPage').show();
                $(".fancypopover, .popover-mask, #modal-close").toggleClass("active");
                $state.go('wall');
            });

        }
    ])

    .controller('LiveCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval',
        function($scope, $rootScope, $http, $location, wall,$interval) {

            var injector = angular.injector(['gleepostweb.utilities']);
            var util = injector.get('util');
            $scope.campusLive = [];

            var getTimeSpan = function(notificationTime){
              var now = moment();
              var notificationDate =moment(notificationTime);
              var diff = now.diff(notificationDate, 'days');
              //console.log(diff);
              return diff;
            };

            var convertToDate = function(date){
                var a =moment(date);
                return a.format("MMM Do YYYY");
            };

            var convertToTime = function(date){
                return moment(date).format('HH:mm');
            };

              var getLive = function(){
                var params ={
                    after :moment().unix()
                };
                wall.getEventPosts(params, function(success){
                    console.log(success);
                    var dummtResults = success;

                    for(var i = 0 ; i < dummtResults.length ; i++){
                        var live={};
                        var dateDiff = getTimeSpan(dummtResults[i].attribs["event-time"]);
                        var evtTime = null
                        if(dateDiff === 0){
                            evtTime = "Today @ " + convertToTime(dummtResults[i].attribs["event-time"]);
                        }
                        else{
                            evtTime = convertToDate(dummtResults[i].attribs["event-time"])
                        }

                        live['id'] = dummtResults[i].id;
                        live['time'] = evtTime;
                        if(dummtResults[i].images !== null)
                          live['image'] = dummtResults[i].images[0];
                        else
                          live['image'] = "";  
                        live['text'] = dummtResults[i].text;

                        $scope.campusLive.push(live);

                        //delete live;
                        //console.log(dummtResults[i].attribs["event-time"])
                    }
                    console.log("my live is: ",$scope.campusLive)

                    $scope.$apply();
                    

                    //console.log($scope.campusLive);     
                }, function(error){

                });
            };
            getLive();
        } 
    ])

    .controller('newEventPost', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval','$state',
        function($scope, $rootScope, $http, $location, wall,$interval,$state) {
            //$(".timeSelectorDirective").hide()
            $scope.objEventDetails= {};

            $scope.objEventDetails['eventType'] = "Party";

            $scope.showClock = false;
            $scope.showNext = false;
            $scope.eventTypeClass = "party-type";
            $scope.calendarDateSelected = function (date) {
                //alert(date);
                $scope.objEventDetails['eventDate'] = date;
                console.log("calendar Date Selected" + date);
                $( ".pickadate" ).fadeOut( "fast" , function() {
                    $scope.showClock = true;
                    setTimeout(function(){ $(".timeSelectorDirective").show().fadeIn( "slow" ); }, 200);
                    $scope.showNext = true;
                } );
                //setTimeout(function(){ $state.go('wall.event.timepicker'); }, 200);

                
            };

            $scope.ddlEventType = function(){
               // alert("yello")
               angular.element('#evtDropDownOptions').hide();
            };

            $scope.chooseEventTypeStep = function(){
                $scope.showClock = false;
                $state.go('wall.event.step2')
            };

            $scope.clickParty = function(){
                $scope.eventTypeClass = "party-type";
                $scope.objEventDetails['eventType'] = "Party";
            };
            $scope.clickMusic = function(){
                $scope.eventTypeClass = "music-type";
                $scope.objEventDetails['eventType'] = "Music";
            };
            $scope.clickSports = function(){
                //alert("sports")
                $scope.eventTypeClass = "sports-type";
                $scope.objEventDetails['eventType'] = "Sports";
            };
            $scope.clickTheater = function(){
                $scope.eventTypeClass = "theater-type";
                $scope.objEventDetails['eventType'] = "Theater";
            };
            $scope.clickSpeaker = function(){
                $scope.eventTypeClass = "speakers-type";
                $scope.objEventDetails['eventType'] = "Speakers";
            };
            $scope.clickOther = function(){
                $scope.eventTypeClass = "others-type";
                $scope.objEventDetails['eventType'] = "Others";
            };

            $scope.setFiles = function(element) {
                $("#btnSubmitGeneralPost").attr("disabled", true)
                $scope.$apply(function(scope) {
                      // Turn the FileList object into an Array
                    $scope.files = []
                    for (var i = 0; i < element.files.length; i++) {
                      $scope.files.push(element.files[i])
                    }
                });

                wall.uploadFile($scope.files[0], null, function(success){
                    console.log("file was created")
                    console.log(success.url);
                    $scope.imageUrl = success.url;
                    $("#btnSubmitGeneralPost").attr("disabled", false)

                }, function(error){

                });
            };

              $scope.hours = 11;
              $scope.minutes = 45;
        } 

    ])

    .controller('newAnnouncementPost', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval','$state',
        function($scope, $rootScope, $http, $location, wall,$interval,$state) {
            $scope.isPostText = false;
            $scope.createAnnouncement = function(){
               var announcementData = {};
               announcementData["text"] = $scope.postText;

                wall.addPost(announcementData, function(response){
                    //console.log(response)
                    location.reload();
                },function(err){})
            };
        } 

    ])

    .controller('newGeneralPost', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval','$state',
        function($scope, $rootScope, $http, $location, wall,$interval,$state) {

            //$scope.files = [];
            //$scope.generalValid = false;
            $scope.imageUrl = null;

            $scope.setFiles = function(element) {
                $("#btnSubmitGeneralPost").attr("disabled", true)
                $scope.$apply(function(scope) {
                      // Turn the FileList object into an Array
                    $scope.files = []
                    for (var i = 0; i < element.files.length; i++) {
                      $scope.files.push(element.files[i])
                    }
                });

                wall.uploadFile($scope.files[0], null, function(success){
                    console.log("file was created")
                    console.log(success.url);
                    $scope.imageUrl = success.url;
                    $("#btnSubmitGeneralPost").attr("disabled", false)

                }, function(error){

                });
            };

            $scope.createGeneralPost = function(){
                //alert("general post created")
                var postData = {};
                postData['title'] = $scope.postTitle;
                postData['text'] = $scope.postDesc;
                postData['url'] = $scope.imageUrl;

                wall.addPost(postData, function(response){
                    //console.log(response)
                    location.reload();
                },function(err){})
            };

            $scope.addImage = function(){
                $("#fileToUpload").trigger("click");
            };
        } 

    ])
.controller('viewPostCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval','$state','$stateParams','$timeout',
        function($scope, $rootScope, $http, $location, wall,$interval,$state,$stateParams,$timeout) {
            $scope.postId=$stateParams.Id;
            console.log($scope.postId)
            $scope.post=[];
            var retrievePost=function(){
                wall.getPost($scope.postId,null,function(response){
                    console.log(response)
                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.post=response;
                            $scope.likers='';
                            if(response.likes){
                                for(var i=0;i<response.likes.length;i++){
                                    $scope.likers+=' '+response.likes[i].by.name+','
                                }
                            }
                        })
                    })
                },function(err){
                    console.log("Error is: ",err)
                })
            }
            retrievePost();
        }

    ]);

 
    



