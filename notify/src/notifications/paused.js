import { NotificationsBase } from './base';

class NotificationsPaused extends NotificationsBase {

  get template() {
    return 'paused.html';
  }

  get subject() {
    return `Request Paused - Action Required: ${this.availabilityRequest.typeSpecific.parkName}`;
  }

}

export { NotificationsPaused };
