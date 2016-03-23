import _ from 'lodash';
import Promise from 'bluebird';

import { config } from './shared/utils/config'; //eslint-disable-line
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { Sns } from './shared/utils/sns';
import { Slack } from './shared/utils/slack';

exports.handler = (event, context) => {
  return new AvailabilityRequestRepo().active().then((availabilityRequests) => {
    const ids = _.map(availabilityRequests, (availabilityRequest) => {
      return availabilityRequest.id;
    });
    if (ids.length > 0) {
      return Promise.map(_.chunk(ids, 10), (chunkIds) => {
        const idsString = _.shuffle(chunkIds).join(',');
        return new Sns('scraper').publish(idsString).then(() => {
          console.log('Sent SNS for:', idsString);
        });
      }).then(() => {
        return Slack.notify(`Active Requests: ${ids.length}`).then(() => {
          context.succeed('sent active requests');
        });
      });
    } else {
      context.succeed('No active requests');
    }
  });
};
