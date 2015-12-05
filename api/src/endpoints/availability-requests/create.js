import _ from 'lodash';

import { AvailabilityRequest, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestCreate {
  constructor(attributes) {
    _.assign(this, attributes);
  }

  valid() {
    // TODO - validation
  }

  create() {
    console.log('AvailabilityRequestCreate');

    let availabilityRequest = new AvailabilityRequest(this);
    let availabilityRequestRepo = new AvailabilityRequestRepo();

    return availabilityRequestRepo.create(availabilityRequest).then((id) => {
      console.log('insert id ', id)
      return availabilityRequestRepo.find(id).then((obj) => {
        console.log('found', obj)
        return obj;
      });
    });
  }
}

export { AvailabilityRequestCreate }
