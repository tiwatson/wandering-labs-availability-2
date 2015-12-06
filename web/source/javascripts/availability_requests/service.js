angular.module('availability_requests.services', [ ]).
  factory('availabilityRequestsService', ['Restangular', 'LocationsService',  function(Restangular, LocationsService){

    var service = {
      base: Restangular.all('availability-requests'),

      all: [],

      siteTypes: [
        { name: 'RV Sites', value: 2001 },
        { name: 'Cabins or Lodgings', value: 10001 },
        { name: 'Tent', value: 2003 },
        { name: 'Trailer', value: 2002 }
      ],

      electricTypes: [
        { name: '15 Amps or More', value: 3002 },
        { name: '20 Amps or More', value: 3003 },
        { name: '30 Amps or More', value: 3004 },
        { name: '50 Amps or More', value: 3005 }
      ],

      locations: LocationsService.locations,

      getList: function(params){
        return service.base.getList(params).then(function(results) {
          service.all = results;
        });
      },

      post: function() {
        console.log('serivce', service.location)
        return service.base.post({
          // required
          email: service.email,
          dateStart: service.dateStart,
          dateEnd: service.dateEnd,
          lengthOfStay: service.lengthOfStay,

          // reserve america specific
          type: 'reserve america',
          typeSpecific: {
            parkName: service.location.originalObject.name,
            parkId: service.location.originalObject.parkId,
            slug: service.location.originalObject.slug,
            code: service.location.originalObject.code,
            state: service.location.originalObject.state,
            siteType: service.siteType.value,
            eqLen: service.eqLen,
            electric: service.electric,
            water: service.water,
            sewer: service.sewer,
            pullthru: service.pullthru,
            waterfront: service.waterfront
          }
        }).then( function(result) {
          service.all.push(result);
          service.dateStart = null;
          service.dateEnd = null;
        });
      },

      cancel: function(id) {
        return service.base.customPOST({}, id + '/cancel');
      },

      put: function(item) {
        return item.put().then(function(results) {

        });
      }

    };

    return service;

  }]);
