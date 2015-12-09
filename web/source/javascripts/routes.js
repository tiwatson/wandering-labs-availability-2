(function () {

  angular
  .module('wl_a.routes', [])
  .config(routeConfig);

  resolveAvailabilityRequest.$inject = ['availabilityRequestsService', '$stateParams'];

  function resolveAvailabilityRequest(availabilityRequestsService, $stateParams) {
    return availabilityRequestsService.base.get($stateParams.arId);
  }

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    //$urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    $stateProvider
    .state('availabilityRequestNew',{
      url: '/',
      templateUrl: 'templates/availability_requests/new.html',
      controller: 'AvailabilityRequestNewController'
    })
    .state('availabilityRequest',{
      url: '/{arId:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}}',
      templateUrl: 'templates/availability_requests/show.html',
      controller: 'AvailabilityRequestController',
      resolve: {
        availabilityRequest: resolveAvailabilityRequest
      }
    })

    .state('availabilityRequestsCancel',{
      url: '/{arId:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}}/cancel',
      templateUrl: 'templates/availability_requests/cancel.html',
      controller: 'AvailabilityRequestCancelController',
      resolve: {
        availabilityRequest: resolveAvailabilityRequest
      }
    })

    ;
  };

})();
