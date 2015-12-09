import _ from 'lodash';
import moment from 'moment';

import { AvailabilityRequestFilters, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestAll {
  constructor(id) {
    this.id = id;
  }

  all() {
    let availabilityRequestRepo = new AvailabilityRequestRepo()
    return availabilityRequestRepo.find(this.id).then((obj)=> {
      return availabilityRequestRepo.scan( AvailabilityRequestFilters.byEmail(obj.email) );
    });
  }
}

export { AvailabilityRequestAll }
