angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicPopup, UserService, $ionicLoading, FACEBOOK_APP_ID) {
   $scope.user = UserService.getUser();

   // A confirm dialog to be displayed when the user wants to log out
   $scope.showConfirmLogOut = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Log out',
       template: 'Are you sure you want to log out?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         //logout
         $ionicLoading.show({
           template: 'Loging out...'
         });

         if (!window.cordova) {
           //this is for browser only
           facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
         }

         facebookConnectPlugin.logout(function(){
           //success
           UserService.deleteUser();
           $ionicLoading.hide();
           $state.go('login');
         },
         function(fail){
           $ionicLoading.hide();
         });
       } else {
        //cancel log out
       }
     });
   };

})

.controller('LoginCtrl', function($scope, $state, $q, UserService, $ionicLoading, FACEBOOK_APP_ID) {
  $scope.slideIndex = 0;

  var fbLogged = $q.defer();

//This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
    var expDate = new Date(
      new Date().getTime() + response.authResponse.expiresIn * 1000
    ).toISOString();

    var authData = {
      id: String(response.authResponse.userID),
      access_token: response.authResponse.accessToken,
      expiration_date: expDate
    }
    fbLogged.resolve(authData);
  };

  //This is the fail callback from the login method
  var fbLoginError = function(error){
    fbLogged.reject(error);
    alert(error);
    $ionicLoading.hide();
  };

  //this method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function () {
    var info = $q.defer();
    facebookConnectPlugin.api('/me', "",
      function (response) {
        info.resolve(response);
      },
      function (response) {
        info.reject(response);
      }
    );
    return info.promise;
  }

//This method is executed when the user press the "Login with facebook" button
  $scope.login = function() {

    if (!window.cordova) {
      //this is for browser only
      facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
    }

    //check if we have user's data stored
    var user = UserService.getUser();

    facebookConnectPlugin.getLoginStatus(function(success){
      // alert(success.status);
     if(success.status === 'connected'){
        // the user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        $state.go('app.feed');

     } else {
        //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
        //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.

        //this is a loader
        $ionicLoading.show({
          template: 'Loging in...'
        });

        //ask the permissions you need
        //you can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.2
        facebookConnectPlugin.login(['email',
                                    'public_profile',
                                    'user_about_me',
                                    'user_likes',
                                    'user_location',
                                    'read_stream',
                                    'user_photos'], fbLoginSuccess, fbLoginError);

        fbLogged.promise.then(function(authData) {

          var fb_uid = authData.id,
              fb_access_token = authData.access_token;

            //get user info from FB
            getFacebookProfileInfo().then(function(data) {

              var user = data;
              user.picture = "http://graph.facebook.com/"+fb_uid+"/picture?type=large";
              user.access_token = fb_access_token;

              //save the user data
              //for the purpose of this example I will store it on ionic local storage but you should save it on a database
              UserService.setUser(user);

              $ionicLoading.hide();
              $state.go('app.feed');
            });
        });
      }
    });
  }
})

.controller('ProfileCtrl', function($scope, $state, UserService) {
  $scope.user = UserService.getUser();
})

.controller('LikesCtrl', function($scope, $state, UserService, FACEBOOK_APP_ID, $q, $ionicLoading) {
  $scope.user = UserService.getUser();

  $scope.doRefresh = function() {
    var likes = $q.defer();

    if (!window.cordova) {
      //this is for browser only
      facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
    }

    $ionicLoading.show({
      template: 'Loading likes...'
    });

    facebookConnectPlugin.api('/'+$scope.user.id+'/likes?access_token='+ $scope.user.access_token, null,
    function (response) {
      likes.resolve(response.data);
    },
    function (response) {
      likes.reject(response);
    });

    likes.promise.then(function(photos){
      $scope.likes = photos;

      $ionicLoading.hide();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    },function(fail){
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doRefresh();
})

.controller('PhotosCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
  $scope.user = UserService.getUser();

  $scope.doRefresh = function() {
    var photos = $q.defer();

    if (!window.cordova) {
      //this is for browser only
      facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
    }

    $ionicLoading.show({
      template: 'Loading photos...'
    });

    facebookConnectPlugin.api('/'+$scope.user.id+'/photos?access_token='+ $scope.user.access_token, null,
    function (response) {
      photos.resolve(response.data);
    },
    function (response) {
      photos.reject(response);
    });

    photos.promise.then(function(photos){
      $scope.photos = photos;

      $ionicLoading.hide();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    },function(fail){
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doRefresh();
})

.controller('FeedCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
  $scope.user = UserService.getUser();

  $scope.doRefresh = function() {
    var feed = $q.defer();

    if (!window.cordova) {
      //this is for browser only
      facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
    }

    $ionicLoading.show({
      template: 'Loading feed...'
    });

    facebookConnectPlugin.api('/'+$scope.user.id+'/home?access_token='+ $scope.user.access_token, null,
      function (response) {
        feed.resolve(response.data);
      },
      function (response) {
        feed.reject(response);
      }
    );

    feed.promise.then(function(feed_response){
      $scope.feed = feed_response;

      $ionicLoading.hide();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    },function(fail){
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doRefresh();
})

.controller('ShareCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
  $scope.user = UserService.getUser();
  $scope.image_to_share = "https://c1.staticflickr.com/9/8322/8057495684_335ee78565_z.jpg";

  if (!window.cordova) {
    //this is for browser only
    facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
  }

  $scope.post_status = function() {
    facebookConnectPlugin.showDialog(
    {
      method:"feed"
    },
    function (response) {
      $ionicLoading.show({ template: 'Status posted!', noBackdrop: true, duration: 2000 });
    },
    function (response) {
    //fail
    });
  };

  $scope.send_message = function() {
    facebookConnectPlugin.showDialog({
      method: 'send',
      link:'http://example.com',
    },
    function (response) {
      $ionicLoading.show({ template: 'Message sent!', noBackdrop: true, duration: 2000 });
    },
    function (response) {
      //fail
    });
  };

  $scope.post_image = function() {
    facebookConnectPlugin.showDialog(
    {
      method: "feed",
      picture: $scope.image_to_share,
      name:'Test Post',
      message:'This is a test post',
      caption: 'Testing using IonFB app',
      description: 'Posting photo using IonFB app'
    },
    function (response) {
      $ionicLoading.show({ template: 'Image posted!', noBackdrop: true, duration: 2000 });
    },
    function (response) {
      //fail
    });
  };

  $scope.share_link = function() {
    facebookConnectPlugin.showDialog(
    {
      method: "share",
      href: 'http://example.com',
    },
    function (response) {
      $ionicLoading.show({ template: 'Link shared!', noBackdrop: true, duration: 2000 });
    },
    function (response) {
      //fail
    });
  };
});
