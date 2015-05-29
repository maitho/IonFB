// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $state) {

  $ionicPlatform.on("deviceready", function(){
	  debugger;
	  alert(facebookConnectPlugin);
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        $state.go('app.feed');
      }else{
        $state.go('login');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $ionicPlatform.on("resume", function(){
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status != 'connected'){
        $state.go('login');
      }
    });
  });

    // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate) {
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){

        }else{
          event.preventDefault();
          $state.go('login');
        }
      },
      function(fail){
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('login', {
    url: "/",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.likes', {
    url: "/likes",
    views: {
      'menuContent': {
        templateUrl: "templates/likes.html",
        controller: 'LikesCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.photos', {
    url: "/photos",
    views: {
      'menuContent': {
        templateUrl: "templates/photos.html",
        controller: 'PhotosCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.feed', {
    url: "/feed",
    views: {
      'menuContent': {
        templateUrl: "templates/feed.html",
        controller: 'FeedCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.share', {
    url: "/share",
    views: {
      'menuContent': {
        templateUrl: "templates/share.html",
        controller: 'ShareCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
