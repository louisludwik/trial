'use strict';

angular.module('gleepostweb')
    .factory('messages', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            getLiveConversation: function(params, success, error) {
                dataService.get('/conversations', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            }

        };
    });