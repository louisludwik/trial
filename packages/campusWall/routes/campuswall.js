'use strict';

//Setting up route
angular.module('gleepostweb.campusWall').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is not connected
        var checkLoggedOut = function($q, $timeout, $http, $location,$cookieStore) {
            // Initialize a new promise
            var deferred = $q.defer();
            var currentUser=$cookieStore.get('user');
            if(!currentUser)
            {
                $timeout(deferred.reject);
                $location.url('/auth/login?returnUri='+'/wall');
            }
            else {
                $timeout(deferred.resolve);
            }
            return deferred.promise;

        };

        // states for my app
        $stateProvider
            .state('wall', {
                url: '/wall',
                templateUrl: 'packages/campusWall/views/index.html',
                resolve: {
                    loggedin: checkLoggedOut
               }
            })
            .state('wall.post', {
                url: '/post/:Id',
                templateUrl: 'packages/campusWall/views/singlepost.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('post', {
                url: '/post/:Id',
                templateUrl: 'packages/campusWall/views/singlepost.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('wall.announcement', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/announcement.html',
                resolve: {
                    loggedin: checkLoggedOut
               },
               activePostTab: 'announcement'
            })
            .state('wall.event', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/event.html',
                resolve: {
                    loggedin: checkLoggedOut
               },
               activePostTab: 'event'
            })
            .state('wall.event.default', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/default.event.html',
                resolve: {
                    loggedin: checkLoggedOut
               }
            })
            .state('wall.event.calendar', {
                //url: '/announcement',
                templateUrl: 'packages/campusWall/views/calendar.event.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('wall.event.timepicker', {
                //url: '/announcement',
                templateUrl: 'packages/campusWall/views/timepicker.event.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('wall.event.step2', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/step2.event.html',
                resolve: {
                    loggedin: checkLoggedOut
               }
            })
            .state('wall.event.step3', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/step3.event.html',
                resolve: {
                    loggedin: checkLoggedOut
               }
            })
            .state('wall.generalPost', {
              //url: '/announcement',
                templateUrl: 'packages/campusWall/views/generalPost.html',
                resolve: {
                    loggedin: checkLoggedOut
               },
               activePostTab: 'general'
            })
            // .state('auth.login', {
            //   url: '/login',
            //   templateUrl: 'packages/users/views/login.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('auth.register', {
            //   url: '/register',
            //   templateUrl: 'packages/users/views/register.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('auth.forgot-password', {
            //   url: '/forgot-password',
            //   templateUrl: 'packages/users/views/forgot-password.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('reset-password', {
            //   url: '/reset/:tokenId',
            //   templateUrl: 'users/views/reset-password.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // });
    }
]);