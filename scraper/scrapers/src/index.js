import { ReserveAmerica } from './reserve-america/index';
import { AvailabilityRequestRepo } from './shared/repos/availability-request';
import { NotificationSns } from './shared/helpers/notification-sns';

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
      console.log('Scrape RETURNS........', newAvailabilities.length);
      return new AvailabilityRequestRepo().updateAvailabilities(availabilityRequest, newAvailabilities);
    })
    .then(()=> {
      if (availabilityRequest.notificationNeeded()) {
        return new NotificationSns('notify', availabilityRequest.id).publish().then(() => {
          console.log('delivered.')
        });
      }
      console.log('Really done now.', availabilityRequest.notificationNeeded());
      // TODO - update availabilityRequest
    });
  }

}

export { Scraper };
