import { AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestCancel {
  constructor(id) {
    this.id = id;
  }

  cancel() {
    return new AvailabilityRequestRepo().cancel(this.id);
  }
}

export { AvailabilityRequestCancel };
