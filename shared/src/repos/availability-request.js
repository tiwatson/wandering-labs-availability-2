import db, { DbHelpers } from '../utils/db';
import { Availability } from './availability';
import { Sns } from '../utils/sns';
import { User } from './user';

import uuid from 'node-uuid';
import { merge } from 'lodash';
import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

class AvailabilityRequest {
  constructor(attributes) {
    _.assign(this, attributes);
  }

  static tableName() {
    return DbHelpers.tableName('AvailabilityRequests');
  }

  static tableOptions() {
    return {
      key_schema: { hash: ['id', 'string'] },
      throughput: { write: 1, read: 1 },
    };
  }
  static columns() {
    return [
      'id',
      'checkedAt',
      'checkedCount',
      'dateEnd',
      'dateStart',
      'email',
      'lengthOfStay',
      'status',
      'type',
      'typeSpecific',
      'availabilities',
    ];
  }

  checkable() {
    const dateLastCheckable = moment.unix(this.dateEnd).subtract(this.lengthOfStay, 'd');
    return moment().isBefore(dateLastCheckable);
  }

  get isPremium() {
    return this.premium === true || User.isPremium(this.email)
  }

  // this should probably be immutable but it is not.
  // also needs a good refactor.
  mergeAvailabilities(newAvailabilities) {
    if (typeof this.availabilities === 'undefined') {
      this.availabilities = [];
    }

    this.availabilities.forEach((availability) => {
      availability.avail = false;
      newAvailabilities.forEach((newAvail, index) => {
        if (typeof newAvail !== 'undefined') {
          const matchedAvail = (availability.siteId === newAvail.siteId && availability.arrivalDate === newAvail.arrivalDate && availability.daysLength === newAvail.daysLength);
          if (matchedAvail) {
            availability.avail = true;
            newAvailabilities[index] = undefined;
          }
        }
      });
    });
    _.compact(newAvailabilities).forEach((newAvail) => {
      this.availabilities.push(_.merge(newAvail, { avail: true, notified: false }));
    });

    if (this.availabilities.length === 0) {
      delete this.availabilities;
    }
  }

  notificationNeeded() {
    let needed = [];
    if (typeof this.availabilities !== 'undefined') {
      needed = this.availabilities.filter((availability) => {
        return availability.avail === true && availability.notified === false;
      });
    }
    return needed.length > 0;
  }

  get dateStartFormatted() {
    return moment.unix(this.dateStart).format('MM/DD/YYYY');
  }

  get dateEndFormatted() {
    return moment.unix(this.dateEnd).format('MM/DD/YYYY');
  }

  get availabilitiesNew() {
    const newAvails = this.availabilities.filter((availability) => {
      return availability.avail === true && availability.notified === false;
    });

    return _.map(_.sortByAll(newAvails, ['arrivalDate']), (availability) => {
      return new Availability(availability, this);
    });
  }

  get availabilitiesOld() {
    const oldAvails = this.availabilities.filter((availability) => {
      return availability.avail === true && availability.notified === true;
    });

    return _.map(_.sortByAll(oldAvails, ['arrivalDate']), (availability) => {
      return new Availability(availability, this);
    });
  }

  get description() {
    return `${this.id} for ${this.email} at ${this.typeSpecific.state}:${this.typeSpecific.parkName} staying ${this.lengthOfStay} days between ${this.dateStartFormatted} and ${this.dateEndFormatted}`;
  }
}

class AvailabilityRequestRepo {
  constructor() {
    this.table = db.table(AvailabilityRequest.tableName());
  }

  find(id) {
    return this.table.find(id).then((resp) => {
      return this.wrapResource(resp);
      // TODO - throw error on not found
    });
  }

  create(obj) {
    const id = uuid.v1();
    const premium = User.isPremium(obj.email)
    const insertData = merge({ id, premium, status: 'active' }, obj);
    return this.table.insert(insertData).then(() => {
      return new Sns('notify').publish({ id, type: 'welcome' }).then(() => {
        return id;
      });
    });
  }

  update(obj) {
    return this.table.update(obj.id, _.omit(obj, 'id'));
  }

  cancel(id) {
    return this.table.find(id).then((resp) => {
      return this.update(_.merge(resp, { status: 'canceled' }));
    });
  }

  status(id, newStatus) {
    return this.table.find(id).then((resp) => {
      return this.update(_.merge(resp, { status: newStatus }));
    });
  }

  scan(filters) {
    console.log("START SCAN")
    const scanLoop = (key) => {
      console.log('SCAN LOOP', key)
      return new Promise(resolve => {
        return this.table.scan({ ExclusiveStartKey: key, attrsGet: AvailabilityRequest.columns(), filters }).then((scanResults) => {
          console.log('SCAN RESULTS - ', (scanResults.items || []).length, scanResults.lastEvaluatedKey)
          const aRequests = (scanResults.items || []).map(aRequest => {
            return this.wrapResource(aRequest);
          });

          if (typeof scanResults.lastEvaluatedKey !== 'undefined') {
            scanLoop(scanResults.lastEvaluatedKey).then((av) => {
              resolve(aRequests.concat(av));
            });
          }
          else {
            resolve(aRequests);
          }
        });
      });
    }
    return scanLoop(null);
  }

  active() {
    return this.scan(AvailabilityRequestFilters.active()).filter((resource) => {
      return resource.checkable();
    });
  }

  activeIds() {
    return this.active().then((results) => {
      return _.map(results, (availabilityRequest) => {
        return availabilityRequest.id;
      });
    });
  }

  updateAvailabilities(availabilityRequest, newAvailabilities) {
    availabilityRequest.mergeAvailabilities(newAvailabilities);
    const checkedCount = availabilityRequest.checkedCount + 1 || 1;
    const status = (!availabilityRequest.isPremium && (checkedCount % 1000 === 0)) ? 'paused' : availabilityRequest.status;
    return this.update(_.merge(availabilityRequest, { checkedAt: moment().unix(), checkedCount, status })).then((obj) => {
      if (status === 'paused') {
        return new Sns('notify').publish({ id: availabilityRequest.id, type: 'paused' }).then(() => {
          console.log('User notified.');
        });
      }
    });
  }

  notifiedAvailabilities(availabilityRequest) {
    availabilityRequest.availabilities.forEach((availability) => {
      availability.notified = true;
    });
    return this.update(availabilityRequest);
  }

  wrapResource(obj) {
    return new AvailabilityRequest(obj);
  }

}

class AvailabilityRequestFilters {
  static byEmail(email) {
    return [
      { column: 'email', value: email },
    ];
  }

  static active() {
    return [
      { column: 'status', value: 'active' },
      { column: 'dateEnd', value: moment().unix().toString(), op: 'GE', type: 'N' },
    ];
  }
}

export { AvailabilityRequest, AvailabilityRequestFilters, AvailabilityRequestRepo };
