import _ from 'lodash';
import moment from 'moment';

import { AvailabilityRequest, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestFind {
  constructor(id) {
    this.id = id;
  }

  find() {
    return new AvailabilityRequestRepo().find(this.id);
  }
}

export { AvailabilityRequestFind }
