import _ from 'lodash';
import Promise from 'bluebird';

import { config } from './shared/utils/config';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { Sns } from './shared/utils/sns';

exports.handler = function(event,context) {
  return new AvailabilityRequestRepo().active().then((availabilityRequests) => {
    let ids = _.map(availabilityRequests, (availabilityRequest) => {
      return availabilityRequest.id;
    });
    if (ids.length > 0) {
      return Promise.map(_.chunk(ids, 10), (chunkIds) => {
        let idsString = _.shuffle(chunkIds).join(',');
        return new Sns('scraper').publish(idsString).then(()=> {
          console.log('Sent SNS for:', idsString);
        });
      }).then(()=> {
        context.succeed('sent active requests');
      });
    }
    else {
      context.succeed('No active requests');
    }
  });
};
