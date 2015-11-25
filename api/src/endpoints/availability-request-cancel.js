
import { AvailabilityRequest, AvailabilityRequestRepo } from '../repos/availability-request';

class AvailabilityRequestCancel {
  static run(event) {
    console.log('AvailabilityRequestCancel');

    let ar = new AvailabilityRequestRepo();
    let id = 'e4ed9d10-90c6-11e5-9101-e555914a6dbb';
    return ar.find(id).then((obj) => {
      console.log('first find', obj)
      return ar.cancel(id).then(() => {
        console.log('canceled')
      })
    })
  }
}

export { AvailabilityRequestCancel }
