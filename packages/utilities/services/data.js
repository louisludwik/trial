'use strict';

angular.module('gleepostweb.utilities').factory('gleepostWebUtilities', [

  function() {
    return {
      name: 'utilities'
    };
  }
]);


angular.module('gleepostweb.utilities').factory('data',['settings',function(settings) {
  	var initInjector = angular.injector(['ng']);
	var $http = initInjector.get('$http');
  var $q=initInjector.get('$q');
	initInjector = angular.injector(['ngCookies']);
	var $cookieStore=initInjector.get('$cookieStore');
	function getUser(){
		var currentUser=$cookieStore.get('user');
    return currentUser;
	};
    return {
      get:function(url,dataToSend,tokenIncluded,userIdIncluded){
        dataToSend=dataToSend||{};
        var user=getUser();
        if(!user && (tokenIncluded==true||userIdIncluded==true))
        {
          console.log("Couldn't get token")
        }
        else
        {
        if(tokenIncluded==true)
          dataToSend['token']=user.token
        if(userIdIncluded==true)
              dataToSend['id']=user.id
          }
        return $http({
          method: "GET",
          url: settings.apiUri+url,
          params: dataToSend,
          headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
      },
      delete:function(url,dataToSend,tokenIncluded,userIdIncluded){
        dataToSend=dataToSend||{};
        var user=getUser();
        if(!user && (tokenIncluded==true||userIdIncluded==true))
        {
          console.log("Couldn't get token")
          return;
        }
        if(tokenIncluded==true)
          dataToSend['token']=user.token
        if(userIdIncluded==true)
              dataToSend['id']=user.id
        return $http({
          method: "DELETE",
          url: settings.apiUri+url,
          params: dataToSend,
          headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
      },
      put:function(url,dataToSend,tokenIncluded,userIdIncluded){
        dataToSend=dataToSend||{};
        var user=getUser();
        if(!user && (tokenIncluded==true||userIdIncluded==true))
        {
          console.log("Couldn't get token")
        }
        if(tokenIncluded==true)
          dataToSend['token']=user.token
        if(userIdIncluded==true)
              dataToSend['id']=user.id
        return $http({
          method: "PUT",
          url: settings.apiUri+url,
          params: dataToSend,
          headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
      },
      post:function(url, dataToSend,tokenIncluded,userIdIncluded){
        dataToSend=dataToSend||{};
        var user=getUser();
        var user=getUser();
        if(!user && (tokenIncluded==true||userIdIncluded==true))
        {
          console.log("Couldn't get token")
        }
        if(tokenIncluded==true)
          dataToSend['token']=user.token
        if(userIdIncluded==true)
              dataToSend['id']=user.id
        return $http({
          method: "POST",
          url: settings.apiUri+url,
          data: $.param(dataToSend),
          headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
      },
      postFile:function(url,file, dataToSend,tokenIncluded,userIdIncluded){
        dataToSend=dataToSend||{};
        var user=getUser();
        var user=getUser();
        if(!user && (tokenIncluded==true||userIdIncluded==true))
        {
          console.log("Couldn't get token")
        }
        if(tokenIncluded==true)
          dataToSend['token']=user.token
        if(userIdIncluded==true)
              dataToSend['id']=user.id 

        var fd = new FormData()
        fd.append("image", file)
        fd.append("token", user.token)
        fd.append("id", user.id)

        return $http.post(settings.apiUri+url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

      }

    };
  }
]);