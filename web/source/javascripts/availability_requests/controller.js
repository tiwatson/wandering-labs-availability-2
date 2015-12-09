angular.module('availability_requests.controllers', [])

  .controller('AvailabilityRequestController', ['$scope', '$state', 'availabilityRequestsService', function($scope, $state, availabilityRequestsService) {
    $scope.ar = availabilityRequestsService;
    $scope.siteOptionsCollapsed = true;

    $scope.submitted = false;

    $scope.newRequest = function() {
      $scope.submitted = true;

      if (availabilityRequestsService.valid() && $scope.arform.$valid) {
        availabilityRequestsService.post().then( function(result) {
          availabilityRequestsService.flash = 'Success. Feel free to add another.';
          availabilityRequestsService.flashClass = 'flash-success';
          $scope.submitted = false;
        }, function(result) {
          availabilityRequestsService.flash = 'Error. Please fix the following and try again: ' + result.data.error;
          availabilityRequestsService.flashClass = 'flash-error';
        });
      }
      else {
        availabilityRequestsService.flash = 'Error. Please complete all required fields';
        availabilityRequestsService.flashClass = 'flash-error';
      }

    };

    $scope.dateStartFilter = function(d) {
      var today = new Date();
      return(d > today);
    };

    $scope.dateEndFilter = function(d) {
      return((typeof $scope.ar.dateStart !== 'undefined') && (d > $scope.ar.dateStart));
    };

  }])

  .controller('AvailabilityRequestsController', ['$scope', '$state', 'availabilityRequestsService', function($scope, $state, availabilityRequestsService) {
    $scope.ar = availabilityRequestsService;
    $scope.predicate = '[-active, -dateStart]';

    availabilityRequestsService.getList();

    $scope.pauseRequest = function(item) {
      item.active = !item.active;
      availabilityRequestsService.put(item);
    };

  }])


  .controller('AvailabilityRequestCancelController', ['$scope', '$state', 'availabilityRequestsService', 'availabilityRequest', function($scope, $state, availabilityRequestsService, availabilityRequest) {
    console.log('just go ahead and cancel???',availabilityRequest);
    availabilityRequestsService.cancel(availabilityRequest.id);
  }])


  ;
