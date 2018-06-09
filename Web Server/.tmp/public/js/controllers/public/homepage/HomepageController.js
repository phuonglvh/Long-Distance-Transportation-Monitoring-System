angular.module('HomepageModule').controller('HomepageController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){

	// set-up loginForm loading state
	$scope.loginForm = {
		loading: false
	}

	$scope.submitLoginForm = function (){
    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.put('/user/login', {
      email: $scope.loginForm.email_username,
      username: $scope.loginForm.email_username,
      password: $scope.loginForm.password
    })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      toastr.success("Đăng nhập thành công", 'Success', {
          closeButton: true,
          timeOut: 2000 
        });
      window.location = '/dashboard';
    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('tên đăng nhập/mật khẩu không đúng.', 'Error', {
          closeButton: true,
          timeOut: 2000 
        });
        return;
      }
				toastr.error('Xuất hiện lỗi. Hãy thử lại.', 'Error', {
					closeButton: true,
					timeOut: 2000 
				});
				return;
    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };


}]);
