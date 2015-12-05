angular.module('wl_a.restangular_config', [ ])
  .config(['RestangularProvider', function(RestangularProvider) {
    // Will want to figure how to turn on for production
    RestangularProvider.setDefaultHttpFields({cache: false});

    RestangularProvider.setBaseUrl('https://ev1wtvxg13.execute-api.us-east-1.amazonaws.com/prod');

    // // add a response intereceptor
    // RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    //   var extractedData;
    //
    //   // Restangular expects the getList call to return an array not an object like spree returns.
    //   // This transforms the return data into an array with pagination items moved to meta key.
    //   if (operation === "getList") {
    //     extractedData = data[what];
    //     delete(data[what]);
    //     extractedData.meta = data;
    //   } else {
    //     extractedData = data;
    //   }
    //   return extractedData;
    // });





  }]);
