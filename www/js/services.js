angular.module('starter.services', [])

.constant("FACEBOOK_APP_ID", "814860211927967")

.service('UserService', function() {

//for the purpose of this example I will store user data on ionic local storage but you should save it on a database


  var setUser = function(user_data) {
    window.localStorage['user'] = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage['user'] || '{}');
  };

  var deleteUser = function(){
      window.localStorage.clear();
  };

  return {
    getUser: getUser,
    setUser : setUser,
    deleteUser : deleteUser
  }
});
