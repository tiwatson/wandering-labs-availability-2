angular.module('availability_requests.controllers', [])

  .controller('AvailabilityRequestController', ['$scope', '$state', 'availabilityRequestsService', function($scope, $state, availabilityRequestsService) {
    $scope.ar = availabilityRequestsService;
    $scope.siteOptionsCollapsed = true;

    $scope.newRequest = function() {
      availabilityRequestsService.post().then( function(result) {
        availabilityRequestsService.flash = 'Success. Feel free to add another.';
        availabilityRequestsService.flashClass = 'flash-success';
      }, function(result) {
        availabilityRequestsService.flash = 'Error. Please fix the following and try again: ' + result.data.error;
        availabilityRequestsService.flashClass = 'flash-error';
      });
    };

    $scope.dateStartFilter = function(d) {
      var today = new Date();
      return(d > today);
    };

    $scope.dateEndFilter = function(d) {
      return((typeof $scope.ar.date_start !== 'undefined') && (d > $scope.ar.date_start));
    };

  }])

  .controller('AvailabilityRequestsController', ['$scope', '$state', 'availabilityRequestsService', function($scope, $state, availabilityRequestsService) {
    $scope.ar = availabilityRequestsService;
    $scope.predicate = '[-active, -date_start]';

    availabilityRequestsService.getList();

    $scope.pauseRequest = function(item) {
      item.active = !item.active;
      availabilityRequestsService.put(item);
    };

  }]);
