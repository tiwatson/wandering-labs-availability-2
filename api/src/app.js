import { config } from './shared/utils/config';

import { AvailabilityRequestFind } from './endpoints/availability-requests/find';
import { AvailabilityRequestCreate } from './endpoints/availability-requests/create';
import { AvailabilityRequestCancel } from './endpoints/availability-requests/cancel';

exports.availabilityRequestFind = function(event, context) {
  return new AvailabilityRequestFind(event.id).find().then((obj) => {
    context.succeed(obj);
  });
}

exports.availabilityRequestCreate = function(event, context) {
  return new AvailabilityRequestCreate(event).create().then((obj) => {
    context.succeed(obj);
  });
}

exports.availabilityRequestCancel = function(event, context) {
  return new AvailabilityRequestCancel(event.id).cancel().then(() => {
    context.succeed({});
  });
}
