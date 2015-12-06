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
      url: '',
      views: {
        'availability_request_new': {
          templateUrl: 'templates/availability_requests/new.html',
          controller: 'AvailabilityRequestController'
        }
      }
    });
  };

})();
