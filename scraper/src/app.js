import Promise from 'bluebird';

import { Scraper } from './index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

exports.handler = (event, context) => {
  const idsString = event.Records[0].Sns.Message;
  const ids = idsString.split(',');

  Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      console.log('Scraping: ', availabilityRequest.description);
      return new Scraper(availabilityRequest).scrape().then(() => {
        console.log('Scraping Complete');
      }).catch((e) => {
        console.log('Scraping Error:', e);
        // TODO - more than just log the error. Alert me.
      });
    });
  }).then(() => {
    console.log('All Scraping complete: ', ids.length);
    context.done(null, 'Done');
  });
};
