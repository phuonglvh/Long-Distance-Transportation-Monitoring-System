angular.module('DashboardModule').controller('DashboardController', ['$location' ,'$scope', '$http', 'toastr', function($location, $scope, $http, toastr){

/*
   ____          _____                _           
  / __ \        |  __ \              | |          
 | |  | |_ __   | |__) |___ _ __   __| | ___ _ __ 
 | |  | | '_ \  |  _  // _ \ '_ \ / _` |/ _ \ '__|
 | |__| | | | | | | \ \  __/ | | | (_| |  __/ |   
  \____/|_| |_| |_|  \_\___|_| |_|\__,_|\___|_|                                                                                                  

*/
$scope.me = window.SAILS_LOCALS.me;

/*  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/
*/
$scope.logout = function() {
    $http.post('/logout')
    .then(function onSuccess(sailsReponse){
		toastr.warning("Logged out successfully!");
      window.location = '/';

    })
    .catch (function onError(sailsResponse){
      toastr.error(sailsResponse);
    })
    .finally(function eitherWay(){

    });
 };


///////////////////////////////////////////////////////
// SERVICE
///////////////////////////////////////////////////////
$scope.GetServiceList = function(){
  $http.get('/service/GetServiceList').success(function(res) {
        //clear the table for new data
        var dataTable1 = $('#AdminServiceListTable').dataTable();
        dataTable1.fnClearTable();
        
        //add new data to table
        for (var i = 0; i < res.length; i++) {
            if((res[i]["note"] == null) || (res[i]["note"] == '')) {
              res[i]["note"] = '';
            }
            /*valid*/
            if((res[i]["valid"] == 0) || (res[i]["valid"] == false) || (res[i]["valid"] == null) || (res[i]["valid"] == null)) {
              res[i]["valid"] = 'Không';
            }
            else res[i]["valid"] = 'Có';

            $('#AdminServiceListTable').dataTable().fnAddData([
              res[i]["id"],
              res[i]["devid"],
              res[i]["devname"],
              res[i]["parameter"],
              res[i]["renter"],
              res[i]["valid"],
              res[i]["dep_Lat"],
              res[i]["dep_Long"],
              res[i]["des_Lat"],
              res[i]["des_Long"],
              res[i]["note"],
              new Date(res[i]["createdAt"]).toLocaleString(),
              new Date(res[i]["updatedAt"]).toLocaleString(),
            ]);
        }       
  });
}; //GetServiceList

$scope.submitChangeValidService = function(ServiceID){
    $http.put('/service/AdminUpdateValid', {
      id: ServiceID,
    })
    .then(function onSuccess(sailsResponse){
      toastr.success("Dịch vụ đã được vô hiệu: " + ServiceID, "Thông báo");
    })
    .catch(function onError(sailsResponse){
      if (sailsResponse.status == 404) {
        toastr.error('Không tìm thấy dịch vụ bạn yêu cầu', "Lỗi");
      }
    })
    .finally(function eitherWay(){
      $('#ChangeValidServiceDialog').modal('hide');
      $scope.GetServiceList();
    });
}; //submitChangeValidService


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HISTORY
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$scope.InitServiceHistoryView = function () {
  $http.get('/service/GetServiceList')
  .then(function onSuccess(sailsReponse){
      toastr.success("Đã cập nhật danh sách dịch vụ", 'Thông báo');
      document.getElementById("SearchHistoryListByDevID").options.length=0;
      var option = document.createElement("option");
          option.text = ""
          option.value = '';
          document.getElementById("SearchHistoryListByDevID").add(option);
          
        for (var i = 0; i < sailsReponse.data.length; i++) {
          var option = document.createElement("option");
          option.text = sailsReponse.data[i].devid.toString();
          option.value = sailsReponse.data[i].devid;
          document.getElementById("SearchHistoryListByDevID").add(option);
        } 
    })
    .catch (function onError(sailsResponse){
      toastr.error(sailsResponse, 'Lỗi');
    })
    .finally(function eitherWay(){

      $http.get('/user/admin')
      .then(function onSuccess(sailsReponse){
          document.getElementById("SearchHistoryListByRenter_Email_ID").options.length = 0;
          var option = document.createElement("option");
              option.text = "";
              option.value = "";
              document.getElementById("SearchHistoryListByRenter_Email_ID").add(option);
              
            for (var i = 0; i < sailsReponse.data.length; i++) {
              var option = document.createElement("option");
              option.text = sailsReponse.data[i].username;
              option.value = sailsReponse.data[i].username;
              document.getElementById("SearchHistoryListByRenter_Email_ID").add(option);
            }//for
        })
        .catch (function onError(sailsResponse){
          toastr.error(sailsResponse, 'Lỗi');
        })
        .finally(function eitherWay(){
        });

    });/*$http.get*/

}; //InitServiceHistoryView


$scope.GetHistoryList = function(){
  $http.get('/service/GetHistoryList').success(function(res) {

        //clear the table for new data
        var dataTable1 = $('#HistoryListTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < res.length; i++) {
            if((res[i]["note"] == null) || (res[i]["note"] == '')) {
              res[i]["note"] = '';
            }
            /*valid*/
            if((res[i]["valid"] == 0) || (res[i]["valid"] == false) || (res[i]["valid"] == null)) {
              res[i]["valid"] = 'Không';
            }
            else res[i]["valid"] = 'Có';

          $('#HistoryListTable').dataTable().fnAddData([
          res[i]["id"],
          res[i]["devid"],
          res[i]["devname"],
          res[i]["renter"],
          res[i]["valid"],
          new Date(res[i]["createdAt"]).toLocaleString(),
          new Date(res[i]["updatedAt"]).toLocaleString(),
          res[i]["dep_Lat"],
          res[i]["dep_Long"],
          res[i]["des_Lat"],
          res[i]["des_Long"],
          res[i]["note"],
          ]);
        }//for  
  });
}; //GetHistoryList

$scope.GetHistoryListByRenter_Email_ID = function(Email_ID){
  $http.post('/service/GetHistoryListByRenter_Email_ID/', 
    {
      email: Email_ID,
      username: Email_ID,
      id: Email_ID,
    }).success(function(serviceList) {
    console.log('length: ' + serviceList.length + ' : ' + serviceList);

    // var serviceList = serviceList;
    $http.get('/device/GetDevInfoByDevId/' + serviceList[0]["devid"]).success(function(res) {

      //clear the table for new data
        var dataTable1 = $('#HistoryListTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < serviceList.length; i++) {
          $('#HistoryListTable').dataTable().fnAddData([
          serviceList[i]["id"],
          serviceList[i]["devid"],
          res.devname,
          serviceList[i]["renter"],
          serviceList[i]["valid"],
          new Date(serviceList[i]["createdAt"]).toLocaleString(),
          new Date(serviceList[i]["updatedAt"]).toLocaleString(),
          serviceList[i]["dep_Lat"],
          serviceList[i]["dep_Long"],
          serviceList[i]["des_Lat"],
          serviceList[i]["des_Long"],
          serviceList[i]["note"],
          ]);
        }//for  
    }); //$http.get
  });//$http.post
}; //GetHistoryList

$scope.GetHistoryListByDevID = function(DevId){
	if($.isNumeric(DevId) && DevId != ''){
		$http.get('/service/GetHistoryListByDevID/'+ DevId).success(function(res) {

        //clear the table for new data
        var dataTable1 = $('#HistoryListTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < res.length; i++) {
          $('#HistoryListTable').dataTable().fnAddData([
          res[i]["id"],
          res[i]["devid"],
          res[i]["devname"],
          res[i]["renter"],
          res[i]["valid"],
          new Date(res[i]["createdAt"]).toLocaleString(),
          new Date(res[i]["updatedAt"]).toLocaleString(),
          res[i]["dep_Lat"],
          res[i]["dep_Long"],
          res[i]["des_Lat"],
          res[i]["des_Long"],
          res[i]["note"],
          ]);
        }//for  
	  });  //$http.get
  }//if
}; //GetHistoryList

$scope.AddServiceForm = {},
$scope.SumitAddService = function(){
    $http.post('/service/AddService', {
      devid: $scope.AddServiceForm.devid,
      RenterEmail: $scope.AddServiceForm.RenterEmail,
      dep_Lat: $scope.AddServiceForm.dep_Lat,
      dep_Long: $scope.AddServiceForm.dep_Long,
      des_Lat: $scope.AddServiceForm.des_Lat,
      des_Long: $scope.AddServiceForm.des_Long,
      note: $scope.AddServiceForm.note,
    })
    .then(function onSuccess(sailsResponse){
      if (sailsResponse.status != 200) {
        toastr.error(sailsResponse.data, 'Lỗi');
      }
      else toastr.success("Dịch vụ đã được thêm!", "Thông báo");
    })
    .catch(function onError(sailsResponse){
    if (sailsResponse.status != 200) {
      toastr.error(sailsResponse.data, '');
    }
    // $scope.signupForm.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);
    })
    .finally(function eitherWay(){
      $scope.AddServiceForm.loading = false;
      $('#AddServiceDialog').modal('hide');
      $scope.GetServiceList();
    });//finally
}; //SumitAddService


///////////////////////////////////////////////////////
// DEVICE
///////////////////////////////////////////////////////
$scope.GetDevList = function(){
  $http.get('/device/GetDevList').success(function(res) {
        //clear the table for new data
        var dataTable1 = $('#MyDeviceTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < res.length; i++) {
          $('#MyDeviceTable').dataTable().fnAddData([
          res[i]["devid"],
          res[i]["devname"],
          res[i]["parameter"],
          new Date(res[i]["createdAt"]).toLocaleString(),
          new Date(res[i]["updatedAt"]).toLocaleString(),
          ]);
        }//for  
        toastr.info("Page loaded!");
  });
}; //GetDevList


$scope.AddDeviceForm = {},
$scope.submitAddDevice = function(){
    $http.post('/device/AddDevice', {
    devid: $scope.AddDeviceForm.devid,
    devname: $scope.AddDeviceForm.devname,
    parameter: $scope.AddDeviceForm.parameter,
    })
    .then(function onSuccess(sailsResponse){
      toastr.success("Thiết bị đã được thêm", 'Thông báo');
    })
    .catch(function onError(sailsResponse){
    if (sailsResponse.status == 409) {
      toastr.error(sailsResponse.data);
      return;
    }
    $scope.AddDeviceForm.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);
    })
    .finally(function eitherWay(){
      $scope.GetDevList();
    });
}; //submitAddDevice

$scope.submitRemoveDevice = function(DevId){
    $http.put('/device/RemoveDevice', {
      devid: DevId,
    })
    .then(function onSuccess(sailsResponse){
      toastr.success("Thiết bị đã được xóa!", "Thông báo");
    })
    .catch(function onError(sailsResponse){
      if (sailsResponse.status == 404) {
        toastr.error(sailsResponse.data, "Lỗi");
      }
      else toastr.error(sailsReponse);
    })
    .finally(function eitherWay(){
      $('#RemoveDeviceDialog').modal('hide');
      $scope.GetDevList();

    });
}; //submitRemoveDevice


}]);// angular.controller







