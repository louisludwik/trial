'use strict';
angular.module('gleepostweb.campusWall')
.filter('calendar', function () {
  		return function (item) {
    		return moment(item).calendar();
  		};
	})
	.filter('fromNow', function () {
  		return function (item) {
    		return moment(item).fromNow();
  		};
	})
.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);