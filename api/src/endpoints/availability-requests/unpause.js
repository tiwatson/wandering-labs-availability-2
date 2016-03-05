import { AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestUnpause {
  constructor(id) {
    this.id = id;
  }

  update() {
    return new AvailabilityRequestRepo().status(this.id, 'active');
  }
}

export { AvailabilityRequestUnpause };
