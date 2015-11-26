import moment from 'moment'
import { merge } from 'lodash';

import { AvailabilityRequest, AvailabilityRequestRepo } from '../src/repos/availability-request'


let Factory = {};
let ModelData = {};

let nextInt = (function() {
  let integerValue = 1;
  return () => {
    return integerValue++;
  };
})();

ModelData.availabilityRequest = function(attrs = {}) {
  return merge({
    "dateStart": moment().subtract(1, 'M').unix(),
    "dateEnd": moment().add(1, 'M').unix(),
    "lengthOfStay": 3,
    "lastRun": moment().subtract(1, 'M').unix(),
    "email": "tim@example.com",

    // reserve america specific
    type: 'reserve america',
    typeSpecific: {
      parkName: 'Bahia Honda',
      parkId: '666',
      state: 'FL',
      siteType: 2001
      // eqLen: null,
      // electric: null,
      // water: null,
      // sewer: null,
      // pullthru: null,
      // waterfront: null
    }
  }, attrs);
};

Factory.availabilityRequestRepo = function(attrs = {}) {
  return new AvailabilityRequestRepo().create( new AvailabilityRequest( ModelData.availabilityRequest(attrs) ) );
}

export { Factory, ModelData }

