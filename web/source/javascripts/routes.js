(function () {

  angular
  .module('wl_a.routes', [ ])
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    //$urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    $stateProvider

    .state('availabilityRequests',{
      url: '/availability_requests',
      views: {
        'availability_request_new': {
          templateUrl: 'templates/availability_requests/new.html',
          controller: 'AvailabilityRequestController'
        }
      }
    })
    .state('availabilityRequests.cancel',{
      url: '/:availabilityRequest/cancel',
      views: {
        'availability_request_cancel': {
          templateUrl: 'templates/availability_requests/cancel.html',
          controller: 'AvailabilityRequestCancelController'
        }
      }
    });

  };

})();
