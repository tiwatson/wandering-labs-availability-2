
import { AvailabilityRequest, AvailabilityRequestRepo } from '../repos/availability-request';

class AvailabilityRequestCreate {

  static run(attrs) {
    console.log('AvailabilityRequestCreate');

    let availabilityRequest = new AvailabilityRequest(attrs);
    let ar = new AvailabilityRequestRepo();

    return ar.create(availabilityRequest).then((id) => {
      console.log('insert id ', id)
      return ar.find(id).then((obj) => {
        console.log('found', obj)
        return obj;
      });
    });
  }
}

export { AvailabilityRequestCreate }
