import _ from 'lodash';

import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { NotificationSns } from './shared/helpers/notification-sns';

exports.handler = function(event,context) {
  return new AvailabilityRequestRepo().active().then((availabilityRequests) => {
    let ids = _.map(availabilityRequests, (availabilityRequest) => {
      return availabilityRequest.id;
    });
    if (ids.length > 0) {
      let idsString = ids.join(',');
      return new NotificationSns('scraper', idsString).publish().then(()=> {
        context.success('sent active requests');
      });
    }
    else {
      context.success('No active requests');
    }
  });
};
