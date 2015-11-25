require('dotenv').config({path: '/Users/tiwatson/Development/wandering-labs/wandering-labs-availability-2/.env'});

import { AvailabilityRequestCreate } from './endpoints/availability-request-create';
import { AvailabilityRequestCancel } from './endpoints/availability-request-cancel';

exports.availabilityRequestCreate = function(event, context) {
  console.log('availabilityRequestCreate')
  return AvailabilityRequestCreate.run(event).then((obj) => {
    console.log('app success', obj)
    context.success(obj);
  });
}

exports.availabilityRequestCancel = function(event, context) {
  AvailabilityRequestCancel.run(event);
}
