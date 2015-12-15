import _ from 'lodash';
import moment from 'moment';

import { AvailabilityRequest, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestCreate {
  constructor(attributes) {
    _.assign(this, attributes);

    if (_.isString(this.dateStart)) {
      this.dateStart = moment(this.dateStart, 'YYYY-MM-DD').unix();
    }
    if (_.isString(this.dateEnd)) {
      this.dateEnd = moment(this.dateEnd, 'YYYY-MM-DD').endOf('day').unix();
    }
    this.lengthOfStay = parseInt(this.lengthOfStay, 10);
  }

  valid() {
    // TODO - validation
  }

  create() {
    console.log('AvailabilityRequestCreate');

    const availabilityRequest = new AvailabilityRequest(this);
    const availabilityRequestRepo = new AvailabilityRequestRepo();

    return availabilityRequestRepo.create(availabilityRequest).then((id) => {
      console.log('insert id ', id);
      return availabilityRequestRepo.find(id).then((obj) => {
        console.log('found', obj);
        return obj;
      });
    });
  }
}

export { AvailabilityRequestCreate };
