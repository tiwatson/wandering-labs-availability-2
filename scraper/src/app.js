import Promise from 'bluebird';

import { config } from './shared/utils/config';
import { Scraper } from './index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

exports.handler = function(event,context) {

  console.log('event', event);

  let idsString = event.Records[0].Sns.Message;
  console.log('idsString', idsString);
  let ids = idsString.split(',');
  console.log('ids', ids);

  Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      return new Scraper(availabilityRequest).scrape().then(() => {
        console.log('Completed scrape')
        context.done(null, "Completed scrape");
      });
    });
  }).then(()=> {
    context.done(null, "Done");
  });


};
