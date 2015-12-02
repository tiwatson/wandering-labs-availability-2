import { Scraper } from './index';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../shared/repos/availability-request';

function main() {
  lets ids = [];

  return Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      return new Scraper(availabilityRequest).then(() => {
        console.log('Complete')
      });
    });
  });

}

main();
// export.handler = function(event, context) {


// }
