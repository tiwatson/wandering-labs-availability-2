import { config } from './shared/utils/config';

import { AvailabilityRequestAll } from './endpoints/availability-requests/all';
import { AvailabilityRequestCancel } from './endpoints/availability-requests/cancel';
import { AvailabilityRequestCreate } from './endpoints/availability-requests/create';
import { AvailabilityRequestFind } from './endpoints/availability-requests/find';

exports.availabilityRequestAll = function(event, context) {
  return new AvailabilityRequestAll(event.id).all().then((objs) => {
    context.succeed(objs);
  });
}

exports.availabilityRequestCancel = function(event, context) {
  return new AvailabilityRequestCancel(event.id).cancel().then(() => {
    context.succeed({});
  });
}

exports.availabilityRequestCreate = function(event, context) {
  return new AvailabilityRequestCreate(event).create().then((obj) => {
    context.succeed(obj);
  });
}

exports.availabilityRequestFind = function(event, context) {
  return new AvailabilityRequestFind(event.id).find().then((obj) => {
    context.succeed(obj);
  });
}
