angular.module('availability_requests.services', [ ]).
  factory('availabilityRequestsService', ['Restangular', 'LocationsService',  function(Restangular, LocationsService){

    var service = {
      base: Restangular.all('availability_requests'),

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
          email: service.email,
          location: {
            name: service.location.originalObjectname,
            park_id: service.location.originalObject.park_id,
            state: service.location.originalObject.state
          },
          date_start: service.date_start,
          date_end: service.date_end,
          days_length: service.days_length,
          site_type: service.site_type.value,
          eq_len: service.eq_len,
          electric: service.electric,
          water: service.water,
          sewer: service.sewer,
          pullthru: service.pullthru,
          waterfront: service.waterfront
        }).then( function(result) {
          service.all.push(result);
          service.date_start = null;
          service.date_end = null;
        });
      },

      put: function(item) {
        return item.put().then(function(results) {

        });
      }

    };

    return service;

  }]);
