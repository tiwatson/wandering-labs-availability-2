import { config } from './shared/utils/config';
import { NotificationsAvailabilities } from './notifications/availabilities';
import { NotificationsWelcome } from './notifications/welcome';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

exports.handler = function(event,context) {
  let id = event.Records[0].Sns.Message;
  return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
    return new NotificationsAvailabilities(availabilityRequest).deliver().then(() => {
      context.succeed('delivery success');
    });
  });

};

exports.welcome = function(event,context) {
  let id = event.Records[0].Sns.Message;
  return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
    return new NotificationsAvailabilities(availabilityRequest).deliver().then(() => {
      context.succeed('delivery success');
    });
  });

};
