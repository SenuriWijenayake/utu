var app = angular.module('app', []);
var api = 'http://localhost:3000';

app.controller('IndexController', function($scope, $http) {
  // Assuming today's date is 04 Dec, 2019
  $scope.date = 'Dec 04, 2019';
  // Populate the data using http call to the server
  $scope.currentData = [];
  $http({
        method: 'POST',
        url: api + '/prices',
        data : {
          date : $scope.date
        },
        type: JSON,
      }).then(function(response) {
        if (response.data) {
          // Bind to the scope variable
          $scope.currentData = response.data;
        }
      }, function(error) {
        console.log("Error occured while retrieving currency prices.");
      });
});
