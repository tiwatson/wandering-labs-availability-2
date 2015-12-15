import { AvailabilityRequestFilters, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestAll {
  constructor(id) {
    this.id = id;
  }

  all() {
    const availabilityRequestRepo = new AvailabilityRequestRepo();
    return availabilityRequestRepo.find(this.id).then((obj) => {
      return availabilityRequestRepo.scan(AvailabilityRequestFilters.byEmail(obj.email));
    });
  }
}

export { AvailabilityRequestAll };
