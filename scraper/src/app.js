import _ from 'lodash';
import Promise from 'bluebird';

import { config } from './shared/utils/config';
import { Scraper } from './index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

exports.handler = function(event,context) {
  let idsString = event.Records[0].Sns.Message;
  let ids = _.shuffle(idsString.split(','));

  Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      console.log('Scraping: ', availabilityRequest.description)
      return new Scraper(availabilityRequest).scrape().then(() => {
        console.log('Scraping Complete');
      });
    });
  }).then(()=> {
    console.log('All Scraping complete: ', ids.length)
    context.done(null, "Done");
  });

};
