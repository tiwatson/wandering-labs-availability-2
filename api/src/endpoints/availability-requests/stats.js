import _ from 'lodash';
import Promise from 'bluebird';
import { AvailabilityRequestFilters, AvailabilityRequestRepo } from '../../shared/repos/availability-request';

class AvailabilityRequestStats {
  constructor() {

  }

  stats() {
    const availabilityRequestRepo = new AvailabilityRequestRepo();
    let all = availabilityRequestRepo.scan({filters: []}).then((results) => {
      let availsCount = _.sum(results.map((r) => {
        let availCount = typeof r.availabilities !== 'undefined' ? r.availabilities.length : 0;
        return(availCount);
      }));
      let foundCount = results.filter((r) => {
        return(typeof r.availabilities !== 'undefined');
      }).length;

      let checked = _.sum(results.map((r) => { return r.checkedCount }));
      let users = _.uniq(results.map((r) => { return r.email })).length;


      return({ total: results.length, avails: availsCount, found: foundCount, checked: checked, users: users});

    });


    let active = availabilityRequestRepo.active().then((results) => {
      let availsCount = _.sum(results.map((r) => {
        let availCount = typeof r.availabilities !== 'undefined' ? r.availabilities.length : 0;
        return(availCount);
      }));
      let foundCount = results.filter((r) => {
        return(typeof r.availabilities !== 'undefined');
      }).length;

      let checked = _.sum(results.map((r) => { return r.checkedCount }));
      let users = _.uniq(results.map((r) => { return r.email })).length;


      return({ total: results.length, avails: availsCount, found: foundCount, checked: checked, users: users});

    });


    return Promise.join(all, active).then((results) => {
      console.log('results', results.length)
      return({all: results[0], active: results[1]});
    });
  }
}

export { AvailabilityRequestStats };
