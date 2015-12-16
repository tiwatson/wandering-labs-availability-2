import { NotificationsBase } from './base';

class NotificationsWelcome extends NotificationsBase {

  get template() {
    return 'welcome.html';
  }

  get subject() {
    return `Campsite Availability Request Confirmed: ${this.availabilityRequest.typeSpecific.parkName}`;
  }

}

export { NotificationsWelcome };
