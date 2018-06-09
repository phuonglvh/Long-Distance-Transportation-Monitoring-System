angular.module('QueryModule').controller('QueryController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){
	$scope.queryData = function (){
    	// Submit request to Sails.

    	$http.put('/getalluser').success(function(res) {
    		for (var i = 0; i < res.length; i++) {
  				$('#dataTable1').dataTable().fnAddData( [
					res[i]["id"],
					res[i]["name"],
					res[i]["email"],
					res[i]["map"]["name"],
					res[i]["posX"],
					res[i]["posY"],
					res[i]["online"] ]
				);
			}				
    	});

    	$http.put('/getallbeacon').success(function(res) {
    		for (var i = 0; i < res['beacons'].length; i++) {
  				$('#dataTable2').dataTable().fnAddData( [
					res['beacons'][i]["id"],
					res['beacons'][i]["name"],
					res['beacons'][i]["model"],
					res['beacons'][i]["map"]["name"],
					res['beacons'][i]["bssid"],
					res['beacons'][i]["working"],
					res['beacons'][i]["posX"],
					res['beacons'][i]["posY"] ]
				);
			}				
    	});

		$http.put('/getallmap').success(function(res) {
			for (var i = 0; i < res.length; i++) {
				$('#dataTable3').dataTable().fnAddData( [
					res[i]["id"],
					res[i]["name"],
					res[i]["width"],
					res[i]["height"],
					res[i]["map_file_path"] ]
				);
			}				
    	});

    	$http.put('/getallrssitraining').success(function(res) {
			for (var i = 0; i < res.length; i++) {
				$('#dataTable4').dataTable().fnAddData( [
					res[i]["beacon"]["name"],
					res[i]["distance"],
					res[i]["angle"],
					res[i]["rssi"] ]
				);
			}				
    	});

    	$http.put('/getallrssiclusters').success(function(res) {
			for (var i = 0; i < res.length; i++) {
				$('#dataTable5').dataTable().fnAddData( [
					res[i]["beacon"]["name"],
					res[i]["id_centroid"],
					res[i]["rssi"] ]
				);
			}				
    	});
  	};
}]);
