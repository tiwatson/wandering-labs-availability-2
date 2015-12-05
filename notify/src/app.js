import { config } from './shared/utils/config';
import { NotificationsAvailabilities } from './notifications/availabilities';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

exports.handler = function(event,context) {

  console.log('event', event);

  let id = event.Records[0].Sns.Message;
  return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
    return new NotificationsAvailabilities(availabilityRequest).deliver().then(() => {
      console.log('delivery success')
      context.succeed('delivery success');
    });
  });

};
