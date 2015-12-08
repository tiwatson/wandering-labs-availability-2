import moment from 'moment';
import _ from 'lodash';

import { ReserveAmerica } from './reserve-america/index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { Sns } from './shared/utils/sns';

const ScraperTypes = { ReserveAmerica: ReserveAmerica };

class Scraper {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;

    const type = 'ReserveAmerica'; // TODO - unhardcode
    this.scraperInstance = new ScraperTypes[type](availabilityRequest);
  }

  scrape() {
    console.log('Scrape#scrape called')
    let availabilityRequest = this.availabilityRequest;
    return this.scraperInstance.perform().then((newAvailabilities) => {
      console.log('Found availabilities: ', newAvailabilities.length);
      return new AvailabilityRequestRepo().updateAvailabilities(availabilityRequest, newAvailabilities);
    })
    .then(()=> {
      if (availabilityRequest.notificationNeeded()) {
        return new Sns('notify').publish(availabilityRequest.id).then(() => {
          console.log('User notified.')
        });
      }
      console.log('No new requests');
      // TODO - update availabilityRequest
    });
  }

}

export { Scraper };
