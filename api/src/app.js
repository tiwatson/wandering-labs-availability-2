
import { AvailabilityRequestCreate } from './endpoints/availability-requests/create';
import { AvailabilityRequestCancel } from './endpoints/availability-requests/cancel';

exports.availabilityRequestCreate = function(event, context) {
  console.log('availabilityRequestCreate', event)
  return AvailabilityRequestCreate(event.Records[0]).create().then((obj) => {
    console.log('app success', obj)
    context.succeed(obj);
  });
}

exports.availabilityRequestCancel = function(event, context) {
  AvailabilityRequestCancel.run(event);
}
