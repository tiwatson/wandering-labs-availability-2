
import { NotificationsBase } from './base'

class NotificationsAvailabilities extends NotificationsBase {

  get template() {
    return 'availabilities.html';
  }

  get subject() {
    return `Campsite Available: ${this.availabilityRequest.typeSpecific.parkName}`;
  }

}

export { NotificationsAvailabilities };
