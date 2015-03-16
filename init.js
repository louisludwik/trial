

angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    //  console.log("hello");
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    //angular.bootstrap(document, ['gleepostweb']);

});

// Default modules
var modules = ['ngCookies', 'ngResource', 'ngAnimate', 'ngFx', 'ui.bootstrap', 'ui.router', 'sc.twemoji', 'truncate',
    'gleepostweb.main', 'gleepostweb.campusWall', 'gleepostweb.dashboard', 'gleepostweb.messenger',
    'gleepostweb.network', 'gleepostweb.notifications', 'gleepostweb.posts', 'gleepostweb.users', 'gleepostweb.search', 'pickadate'
];

// Combined modules
angular.module('gleepostweb', modules)
        .run(function ($rootScope, $cookieStore, Profile, $timeout) {
            $rootScope.window = window;
            window.UserName = "";
            window.isLoggedIn = false;
            if ($cookieStore.get('user')) {
                window.isLoggedIn = true;
                window.userId = $cookieStore.get('user').id;
            }
            $rootScope['newMessage'] = [];
            $rootScope['newRead'] = [];
            $rootScope['newConversation'] = [];
            $rootScope['endedConversation'] = [];
            $rootScope['changedConversation'] = [];
            $rootScope['notification'] = [];
            $rootScope['VideoReady'] = [];
            $rootScope.$watch('window.isLoggedIn', function (newValue, oldValue) {
                console.log("Changed");

                if (newValue == true)
                {
                    $rootScope.$broadcast('newNotificationReceived', $rootScope.notification);
                    $rootScope.$broadcast('newMessageReceived', $rootScope.newMessage);
                    var user = $cookieStore.get('user');
                    window.userId = user.id;
                    window.UserName = user.full_name;
                    window.UserImage = user.profile_image;
                    /////////////////////////////////////
                    var initInjector = angular.injector(['ng']);
                    var $http = initInjector.get('$http');
                    var $q = initInjector.get('$q');
                    var Service = {};
                    var callbacks = {};
                    var currentCallbackId = 0;
                    var ws = {};
                    if ($cookieStore.get('user')) {
                        var uri = 'wss://dev.gleepost.com:443/api/v1/ws?token=' + $cookieStore.get('user').token + '&id=' + $cookieStore.get('user').id;
                        //var uri='wss://gleepost.com/api/v1//ws?token='+$cookieStore.get('user').token+'&id='+$cookieStore.get('user').id;
                        ws = new WebSocket(uri);
                    }
                    ws.onopen = function () {
                        console.log("Socket has been opened!");
                    };

                    ws.onmessage = function (message) {
                        listener(JSON.parse(message.data));
                    };
                    ws.onclose = function (ev) {
                        console.log('disconnected to server ');
                        if (window.isLoggedIn == true)
                            ws = new WebSocket(uri);
                    }
                    ws.onerror = function (error) {
                        console.log('WebSocket Error ' + error);
                        if (window.isLoggedIn == true)
                            ws = new WebSocket(uri);
                    };
                    function listener(data) {
                        var messageObj = data;
                        console.log("Received data from websocket: ", messageObj);
                        if (messageObj.type == 'message')
                        {
                            $rootScope['newMessage'].push(messageObj);
                            $rootScope.$broadcast('newMessageReceived', $rootScope.newMessage);
                        }
                        else if (messageObj.type == 'read') {
                            $rootScope['newRead'].push(messageObj);
                            $rootScope.$broadcast('newReadReceived', $rootScope.newRead);
                        }
                        else if (messageObj.type == 'new-conversation')
                            $rootScope['newConversation'].push(messageObj);
                        else if (messageObj.type == 'ended-conversation')
                            $rootScope['endedConversation'].push(messageObj);
                        else if (messageObj.type == 'changed-conversation')
                            $rootScope['changedConversation'].push(messageObj);
                        else if (messageObj.type == 'notification') {
                            $rootScope['notification'].push(messageObj);
                            $rootScope.$broadcast('newNotificationReceived', $rootScope.notification);
                        }
                        else if (messageObj.type == 'video-ready')
                            $rootScope['VideoReady'].push(messageObj);

                        // If an object exists with callback_id in our callbacks object, resolve it
                        if (callbacks.hasOwnProperty(messageObj.callback_id)) {
                            $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
                            delete callbacks[messageObj.callbackID];
                        }
                    }
                    // This creates a new callback ID for a request
                    function getCallbackId() {
                        currentCallbackId += 1;
                        if (currentCallbackId > 10000) {
                            currentCallbackId = 0;
                        }
                        return currentCallbackId;
                    }////////////////////////
                }
            });
        });