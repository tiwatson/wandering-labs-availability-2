import { AvailabilityRequestRepo } from '../shared/repos/availability-request';
import { NotificationsBase } from './base';

class NotificationsAvailabilities extends NotificationsBase {

  get template() {
    return 'availabilities.html';
  }

  get subject() {
    return `Campsite Available: ${this.availabilityRequest.typeSpecific.parkName}`;
  }

  deliver() {
    return this._deliver().then((response) => {
      return new AvailabilityRequestRepo().notifiedAvailabilities(this.availabilityRequest).then(() => {
        return response;
      });
    });
  }
}

export { NotificationsAvailabilities };
