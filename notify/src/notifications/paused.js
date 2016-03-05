import { NotificationsBase } from './base';

class NotificationsPaused extends NotificationsBase {

  get template() {
    return 'paused.html';
  }

  get subject() {
    return `Campsite Availability Request Confirmed: ${this.availabilityRequest.typeSpecific.parkName}`;
  }

}

export { NotificationsPaused };
