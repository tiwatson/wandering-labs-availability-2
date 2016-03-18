import Promise from 'bluebird';

import { config } from './shared/utils/config'; //eslint-disable-line
import { Scraper } from './index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { Slack } from './shared/utils/slack';

exports.handler = (event, context) => {
  const slack = new Slack();
  const idsString = event.Records[0].Sns.Message;
  const ids = idsString.split(',');

  Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      console.log('Scraping: ', availabilityRequest.description);
      return new Scraper(availabilityRequest).scrape().then(() => {
        console.log('Scraping Complete');
        return slack.notify(`Scraping Complete: ${id}`);

      }).catch((e) => {
        console.log('Scraping Error:', e);
        return slack.notify(`Scraping Error: ${id} - ${e}`);
        // TODO - more than just log the error. Alert me.
      });
    });
  }).then(() => {
    console.log('All Scraping complete: ', ids.length);
    context.done(null, 'Done');
  });
};
