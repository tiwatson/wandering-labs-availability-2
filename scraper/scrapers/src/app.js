import { Scraper } from './index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';

export.handler = function(event, context) {

  let idsString = event.Records[0].Sns.Message;
  console.log('idsString', idsString);
  let ids = idsString.split(',');
  console.log('ids', ids);

  Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      return new Scraper(availabilityRequest).then(() => {
        console.log('Completed scrape')
      });
    });
  }).then(()=> {
    context.done(null, "Done");
  });
};
