angular.module('wl_availability', [
  'ui.router',
  'restangular',
  'angucomplete-alt',
  'ngQuickDate',
  'angularMoment',
  'wl_a.routes',
  'wl_a.restangular_config',
  'wl_a.quickDatePickerDefaults',
  'wl_a.availability_requests'
])
.config(['$httpProvider', function($httpProvider){
  // $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
}]);
