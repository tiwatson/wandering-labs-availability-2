import { ReserveAmerica } from './reserve-america/index';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../shared/repos/availability-request';

function main() {


  lets ids = [];

  return Promise.each(ids, (id) => {
    return new AvailabilityRequestRepo().find(id).then((availabilityRequest) => {
      return new ReserveAmerica().work(availabilityRequest).then((foundAvailabilities) => {
        console.log('worked')
      });
    });
  });

}

main();
// export.handler = function(event, context) {


// }
