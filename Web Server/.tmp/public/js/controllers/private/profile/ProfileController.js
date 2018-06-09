angular.module('ProfileModule').controller('ProfileController', ['$location' ,'$scope', '$http', 'toastr', function($location, $scope, $http, toastr){

/*
   ____          _____                _           
  / __ \        |  __ \              | |          
 | |  | |_ __   | |__) |___ _ __   __| | ___ _ __ 
 | |  | | '_ \  |  _  // _ \ '_ \ / _` |/ _ \ '__|
 | |__| | | | | | | \ \  __/ | | | (_| |  __/ |   
  \____/|_| |_| |_|  \_\___|_| |_|\__,_|\___|_|                                                                                                  

*/
/*L  O A D I N G - S T A T E*/
$scope.userList = {
    loading: false,
  }

$scope.tabs = {
  adminTab : false,
  editTab: false,
}
/*M E - D I C T I O N A R Y*/
$scope.me = window.SAILS_LOCALS.me;


/*  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/
*/
/*ADMIN TAB*/
$scope.admin = function() {
  $scope.tabs.editTab = false;
  $scope.tabs.adminTab = true;
  $http.get('/user/admin')
    .then(function onSuccess(sailsResponse){
      $scope.userList.contents = sailsResponse.data;
    })
    .catch(function onError(sailsResponse){
      console.error(sailsResponse);
      console.log('error here')
      $scope.userList.errorMsg = sailsResponse;
    })
    .finally(function eitherWay(){
      $scope.userList.loading = false;
      // console.log(userList);
    });
};


/*LOGOUT ACTION*/
$scope.logout = function() {
    $http.post('/logout')
    .then(function onSuccess(sailsReponse){
      toastr.warning('Đã đăng xuất.', 'Warning', {
          closeButton: true,
          timeOut: 4000 
      });
      window.location = '/';

    })
    .catch (function onError(sailsResponse){
      console.error(sailsResponse);
    })
    .finally(function eitherWay(){

    });
 };

$scope.saveAdmin = function(id, change){
    //debug 
    console.log('$scope.saveDeleted');
    //end debug

    var theRoute = '/user/update-admin/' + id;
    $scope.userList.loading = true;

    // Submit PUT request to Sails.
    $http.put(theRoute, {
        id: id,
        admin: change
      })
      .then(function onSuccess(sailsResponse) {
        toastr.success('user record saved!','', { timeOut: 1000 });
      })
      .catch(function onError(sailsResponse) {
        $scope.editProfile.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);

      })
      .finally(function eitherWay() {
        $scope.userList.loading = false;

      });
  };

  $scope.saveBanned = function(id, change){
    //debug 
    console.log('$scope.saveDeleted');
    //end debug


    $scope.userList.loading = true;
    var theRoute = '/user/update-banned/' + id;
    // Submit PUT request to Sails.
    $http.put(theRoute, {
        id: id,
        banned: change
      })
      .then(function onSuccess(sailsResponse) {
        toastr.success('user record saved!','', { timeOut: 1000 });
      })
      .catch(function onError(sailsResponse) {
        $scope.editProfile.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);
      })
      .finally(function eitherWay() {
        $scope.userList.loading = false;
      });

  };

  $scope.saveDeleted = function(id, change){
    //debug 
    console.log('$scope.saveDeleted');
    //end debug

    var theRoute = '/user/update-deleted/' + id;
    $scope.userList.loading = true;

    // Submit PUT request to Sails.
    $http.put(theRoute, {
        id: id,
        deleted: change
      })
      .then(function onSuccess(sailsResponse) {
        toastr.success('user record saved!','', { timeOut: 1000 });
      })
      .catch(function onError(sailsResponse) {
        $scope.editProfile.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);

      })
      .finally(function eitherWay() {
        $scope.userList.loading = false;
      });

  };


/*EDIT PARTITION*/
  $scope.editProfile = {
    properties: {},
    errorMsg: '',
    error: false,
    saving: false,
    loading: false,
    changePassword: {}
  };


/*EDIT TAB*/
$scope.edit = function() {
  $scope.tabs.adminTab = false;
  $scope.tabs.editTab = true;
  $http.get('/user/admin')
    .then(function onSuccess(sailsResponse){
      //debug
      console.log('get /user/admin sent\n');
      console.log($scope.userList.contents);


      $scope.userList.contents = sailsResponse.data;
    })
    .catch(function onError(sailsResponse){
      console.error(sailsResponse);
      console.log('error here')
      $scope.userList.errorMsg = sailsResponse;
    })
    .finally(function eitherWay(){

      $scope.userList.loading = false;
      // console.log(userList);
    });
};


/*CHANGE PASSWORD*/
 $scope.changeMyPassword = function() {

    $http.put('/user/change-password', {
        // id: $scope.me.id,
        password: $scope.editProfile.properties.password
      })
      .then(function onSuccess(sailsResponse) {

    
        // window.location = '#/profile/' + $scope.editProfile.properties.id;
        window.location='/';
        // toastr.success('Password Updated!');

        $scope.editProfile.loading = false;
      })
      .catch(function onError(sailsResponse) {
        
        // Otherwise, display generic error if the error is unrecognized.
        $scope.editProfile.changePassword.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);

      })
      .finally(function eitherWay() {
        $scope.editProfile.loading = false;
      });

  };

/*CHANGE GRAVATAR*/
$scope.updateGravatarUrl = function() {
      $http.put('/user/update-gravatarUrl', {
        gravatarURL: $scope.me.gravatarURL
        // gravatarURL: $scope.editProfile.properties.gravatarURL
      })
      .then(function onSuccess(sailsResponse) {
        window.location = '/';

        $scope.editProfile.loading = false;
      })
      .catch(function onError(sailsResponse) {
        // console.log(sailsResponse);
        // Otherwise, display generic error if the error is unrecognized.
        $scope.editProfile.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);

      })
      .finally(function eitherWay() {
        $scope.editProfile.loading = false;
      });
  };

/*REMOVE PROFILE*/
 $scope.removeProfile = function() {
    //debug
    console.log('ProfileController/removeProfile');
    //end debug


    $scope.editProfile.loading = true;
    $http.put('/user/remove-profile', {
      deleted: true
    })
    .then(function onSuccess(sailsResponse) {
      // $scope.editProfile.properties.gravatarURL = sailsResponse.data.gravatarURL;
      window.location = '/';
      // 
      // toastr.success('Password Updated!');
    })
    .catch(function onError(sailsResponse) {
      // Otherwise, display generic error if the error is unrecognized.
      $scope.editProfile.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);

    })
    .finally(function eitherWay() {
      $scope.editProfile.loading = false;
    });
  };
}]);



