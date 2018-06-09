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
      toastr.warning('Logged out successfully.', 'Warning', {
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


///////////////////////////////////////////////////////
// SERVICE
///////////////////////////////////////////////////////
$scope.GetServiceList = function(){
  $http.get('/service/GetServiceList')
  .then(function onSuccess(sailsReponse){
      toastr.success("Đã cập nhật danh sách dịch vụ", 'Thông báo');
      var dataTable1 = $('#UserServiceListTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < sailsReponse.data.length; i++) {
          /*note*/
          if((sailsReponse.data[i]["note"] == null) || (sailsReponse.data[i]["note"] == '')) {
            sailsReponse.data[i]["note"] = '';
          }
          /*valid*/
          if((sailsReponse.data[i]["valid"] == 0) || (sailsReponse.data[i]["valid"] == false) || (sailsReponse.data[i]["valid"] == null)) {
            sailsReponse.data[i]["valid"] = 'Không';
          }
          else sailsReponse.data[i]["valid"] = 'Có';
          

          if(!$scope.me.admin){
            $('#UserServiceListTable').dataTable().fnAddData([
              sailsReponse.data[i]["id"],
              sailsReponse.data[i]["devid"],
              sailsReponse.data[i]["devname"],
              sailsReponse.data[i]["parameter"],
              sailsReponse.data[i]["valid"],
              sailsReponse.data[i]["note"],
              new Date(sailsReponse.data[i]["createdAt"]).toLocaleString(),
              new Date(sailsReponse.data[i]["updatedAt"]).toLocaleString(),
            ]);
          }
        } 
        document.getElementById("SearchServiceDataByDevId").options.length = 0;
        var option = document.createElement("option");
            option.text = "";
            option.value = "";
            document.getElementById("SearchServiceDataByDevId").add(option);
            
          for (var i = 0; i < sailsReponse.data.length; i++) {
            var option = document.createElement("option");
            option.text = sailsReponse.data[i].devid.toString();
            option.value = sailsReponse.data[i].devid;
            document.getElementById("SearchServiceDataByDevId").add(option);
          }//for
    })
    .catch (function onError(sailsResponse){
      toastr.error(sailsResponse, 'Lỗi');
    })
    .finally(function eitherWay(){

    });/*$http.get*/

}; //GetServiceList


$scope.GetServiceDataByID = function(DevId){
  $http.get('/service/GetServiceDataByID/' + DevId)
  .then(function onSuccess(sailsReponse){
      toastr.success('Thông tin dịch vụ của thiết bị: ' + DevId + ' đã được cập nhật', 'Thông báo');
      var dataTable1 = $('#UserServiceListTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
          if(!$scope.me.admin){
            $('#UserServiceListTable').dataTable().fnAddData([
              sailsReponse.data["id"],
              sailsReponse.data["devid"],
              sailsReponse.data["devname"],
              sailsReponse.data["parameter"],
              sailsReponse.data["valid"],
              sailsReponse.data["note"],
              new Date(sailsReponse.data["createdAt"]).toLocaleString(),
              new Date(sailsReponse.data["updatedAt"]).toLocaleString(),
            ]);
          }
    })
    .catch (function onError(sailsResponse){
      if(sailsResponse.status == 404){
        toastr.error('Không tìm thấy dịch vụ của thiết bị: ' + DevId, 'Lỗi');
      }
      else{
        toastr.error(sailsResponse, 'Lỗi');
      }
    })
    .finally(function eitherWay(){
    });/*$http.get*/

}; //GetServiceLis

$scope.InitChartView = function () {
	$.get('/service/GetServiceList', function(getRes, status){
          document.getElementById("SearchChartByDevId").options.length = 0;
					var option = document.createElement("option");
              option.text = "";
              option.value = "";
              document.getElementById("SearchChartByDevId").add(option);
              
            for (var i = 0; i < getRes.length; i++) {
              var option = document.createElement("option");
              option.text = getRes[i].devid.toString();
              option.value = getRes[i].devid;
              document.getElementById("SearchChartByDevId").add(option);
            }//for
        });/*get*/
}; //InitChartView


///////////////////////////////////////////////////////
// DEVICE
///////////////////////////////////////////////////////
$scope.GetDevDataByID = function(DevId){
  if(!DevId || DevId ==""){
    var dataTable1 = $('#dataTable1').dataTable();
      dataTable1.fnClearTable();
  }
  else{
    $http.get('/data_collect/GetDevDataByID/' + DevId).success(function(res) {
      // console.log(res + ' : ' + res.length);
          //clear the table for new data
          var dataTable1 = $('#dataTable1').dataTable();
          dataTable1.fnClearTable();

          //add new data to table
          for (var i = 0; i < res.length; i++) {
            $('#dataTable1').dataTable().fnAddData([
            res[i]["devid"],
            // res[i]["devname"],
            res[i]["packetid"],
            res[i]["humid"],
            res[i]["temp"],
            res[i]["Lat"],
            res[i]["Long"],
            res[i]["locked"],
            res[i]["timestamp"],
            new Date(res[i]["createdAt"]).toLocaleString(),
            ]);
          }       
    }); 
  } 
}; //GetDevDataByID


/*GetDevList*/
$scope.GetDevList = function(){
  $http.get('/device/GetDevList').success(function(res) {
    // console.log(res);

        //clear the table for new data
        var dataTable1 = $('#MyDeviceTable').dataTable();
        dataTable1.fnClearTable();

        //add new data to table
        for (var i = 0; i < res.length; i++) {
          $('#MyDeviceTable').dataTable().fnAddData([
          res[i]["devid"],
          res[i]["devname"],
          res[i]["parameter"],
          //new Date(res[i]["createdAt"]).toLocaleString(),
          ]);
        }//for  
  });
}; /*GetDevList*/


//////////////////////////////////////////////////////////////
// THRESHOLD
//////////////////////////////////////////////////////////////
$scope.UpdateThresholdForm = {},
$scope.submitUpdateThreshold = function(){
    $http.put('/threshold/UpdateThreshold', {
      devid: $scope.UpdateThresholdForm.devid,
      upperTemp: $scope.UpdateThresholdForm.upperTemp,
      lowerTemp: $scope.UpdateThresholdForm.lowerTemp,
      upperHumid: $scope.UpdateThresholdForm.upperHumid,
      lowerHumid: $scope.UpdateThresholdForm.lowerHumid,
    })
    .then(function onSuccess(sailsResponse){
      toastr.success("Đã cập nhật ngưỡng của thiết bị: " + $scope.UpdateThresholdForm.devid);
      $scope.InitWarningView();
    })
    .catch(function onError(sailsResponse){
      if (sailsResponse.status == 409) {
        toastr.error(sailsResponse);
      }
      else if(sailsResponse.status == 404){
        toastr.error("Mã thiết bị không có trong danh sách! Vui lòng thử lại!", "Lỗi");
      }
    })
    .finally(function eitherWay(){
      $('#UpdateThresholdDialog').modal('hide');

    });
}; //submitUpdateThreshold

/*submitRemoveThreshold*/
$scope.submitRemoveThreshold = function(DevId){
    // console.log('submitRemoveThreshold');
    $http.put('/threshold/RemoveThreshold', {
      devid: DevId,
    })
    .then(function onSuccess(sailsResponse){
      toastr.success("Đã xóa ngưỡng của thiết bị: " + DevId);
      $scope.InitWarningView();
    })
    .catch(function onError(sailsResponse){
      if (sailsResponse.status == 409) {
        toastr.error(sailsResponse.data);
      }
      else if(sailsResponse.status == 404){
        toastr.error("Mã thiết bị không có trong danh sách! Vui lòng thử lại!", "Lỗi");
      }
    })
    .finally(function eitherWay(){
      $('#RemoveThresholdDialog').modal('hide');
    });
}; /*submitRemoveThreshold*/


$scope.InitWarningView = function () {
   $scope.GetWarningList();
   $scope.GetThresholdList();
}; /*InitWarningView*/

$scope.GetWarningList = function(){
$http.get('/warning/GetWarningList')
    .then(function onSuccess(sailsResponse){
      toastr.success("Danh sách cảnh báo đã được cập nhật!", "Thông báo");

      //clear the table for new data
      var MyWarningTable = $('#MyWarningTable').dataTable();
      MyWarningTable.fnClearTable();

      //add new data to table
      if(sailsResponse.data.length){
        for (var i = 0; i < sailsResponse.data.length; i++) {
          $('#MyWarningTable').dataTable().fnAddData([
            sailsResponse.data[i]["devid"],
            sailsResponse.data[i]["message"],
            new Date(sailsResponse.data[i]["timestamp"]).toLocaleString(),
          ]);
          // if(sailsResponse.data[i]["message"] != ''){
          //   toastr.warning('Thời điểm: '+ new Date(sailsResponse.data[i]["timestamp"]).toLocaleString() + '\n Thiết bị: ' + sailsResponse.data[i]["devid"] + '\nNội dung: ' + sailsResponse.data[i]["message"], "Cảnh báo", 'trustedHtml');
          // }
        }//for  
      }//if
    })
    .catch(function onError(sailsResponse){
      //clear the table for new data
      var MyWarningTable = $('#MyWarningTable').dataTable();
      MyWarningTable.fnClearTable();

      if (sailsResponse.status == 404) {
        toastr.error("Danh sách cảnh báo không có dữ liệu nào!", "Cảnh báo");
      }
      else toastr.error(sailsReponse);
    })
    .finally(function eitherWay(){});

}; /*GetWarningList*/


$scope.GetThresholdList = function(){
  $http.get('/threshold/GetThresholdList')
  .then(function onSuccess(sailsResponse){
    toastr.success("Danh sách ngưỡng đã được cập nhật", "Thông báo");
    
   //clear the table for new data
    var MyThresholdTable = $('#MyThresholdTable').dataTable();
    MyThresholdTable.fnClearTable();
    //add new data to table
    for (var i = 0; i < sailsResponse.data.length; i++) {
      $('#MyThresholdTable').dataTable().fnAddData([
        sailsResponse.data[i]["devid"],
        sailsResponse.data[i]["upperHumid"],
        sailsResponse.data[i]["lowerHumid"],
        sailsResponse.data[i]["upperTemp"],
        sailsResponse.data[i]["lowerTemp"],
      ]);
    }//for  
  })
  .catch(function onError(sailsResponse){
    //clear the table for new data
    var MyThresholdTable = $('#MyThresholdTable').dataTable();
    MyThresholdTable.fnClearTable();

    if (sailsResponse.status == 409) {
      toastr.error(sailsResponse.data, "Lỗi");
    }
    else if(sailsResponse.status == 404){
      toastr.error("Mã thiết bị không có trong danh sách! Vui lòng thử lại!", "Lỗi");
    }
  })
  .finally(function eitherWay(){
    // setInterval(function(){$scope.LoopWarning()}, 10000);         
  });
};
}]);// angular.controller







