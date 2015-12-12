import { config } from './shared/utils/config';
import { NotificationsAvailabilities } from './notifications/availabilities';
import { NotificationsWelcome } from './notifications/welcome';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

const NotificationClasses = { availabilities: NotificationsAvailabilities, welcome: NotificationsWelcome }

exports.handler = function(event,context) {
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('message:', message);
  return new AvailabilityRequestRepo().find(message.id).then((availabilityRequest) => {
    const notificationClassInstance = new NotificationClasses[message.type](availabilityRequest);
    console.log('WHAT?', availabilityRequest)
    return notificationClassInstance.deliver().then(() => {
      context.succeed('delivery success');
    });
  });
};
