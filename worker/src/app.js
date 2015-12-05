import _ from 'lodash';

import { config } from './shared/utils/config';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { Sns } from './shared/utils/sns';

exports.handler = function(event,context) {
  return new AvailabilityRequestRepo().active().then((availabilityRequests) => {
    let ids = _.map(availabilityRequests, (availabilityRequest) => {
      return availabilityRequest.id;
    });
    if (ids.length > 0) {
      let idsString = ids.join(',');
      return new Sns('scraper').publish(idsString).then(()=> {
        context.succeed('sent active requests', ids);
      });
    }
    else {
      context.succeed('No active requests');
    }
  });
};
