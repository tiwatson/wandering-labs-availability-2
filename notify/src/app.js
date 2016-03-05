import { config } from './shared/utils/config'; //eslint-disable-line
import { NotificationsAvailabilities } from './notifications/availabilities';
import { NotificationsPaused } from './notifications/paused';
import { NotificationsWelcome } from './notifications/welcome';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

const NotificationClasses = { availabilities: NotificationsAvailabilities, welcome: NotificationsWelcome, paused: NotificationsPaused };

exports.handler = (event, context) => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  return new AvailabilityRequestRepo().find(message.id).then((availabilityRequest) => {
    const notificationClassInstance = new NotificationClasses[message.type](availabilityRequest);
    return notificationClassInstance.deliver().then(() => {
      context.succeed('delivery success');
    });
  });
};
