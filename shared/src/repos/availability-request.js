import db, { DbHelpers } from '../utils/db';
import { Availability } from './availability';

import uuid from 'node-uuid';
import { merge } from 'lodash';
import _ from 'lodash';
import moment from 'moment'

class AvailabilityRequest {
  constructor(attributes) {
    Object.assign(this, attributes);
  }

  static tableName() {
    return DbHelpers.tableName('AvailabilityRequests');
  }

  static tableOptions() {
    return {
      key_schema: { hash: ['id', 'string'] },
      throughput: { write: 1, read: 1 }
    }
  }
  static columns() {
    return {};
  }

  checkable() {
    let dateLastCheckable = moment.unix(this.dateEnd).subtract(this.daysLength, 'd');
    return moment().isBefore(dateLastCheckable);
  }

  // this should probably be immutable but it is not.
  // also needs a good refactor.
  mergeAvailabilities(newAvailabilities) {
    if (typeof this.availabilities === 'undefined') {
      this.availabilities = [];
    }

    for (let availability of this.availabilities) {
      availability.avail = false;
      for (let i = newAvailabilities.length - 1; i >= 0; i--) {
        let newAvail = newAvailabilities[i]
        let matchedAvail = (availability.siteId == newAvail.siteId && availability.arrivalDate == newAvail.arrivalDate && availability.daysLength == newAvail.daysLength)
        if (matchedAvail) {
          availability.avail = true;
          newAvailabilities[i] = null;
        }
      }
    }
    for (let newAvail of _.compact(newAvailabilities)) {
      this.availabilities.push(_.merge(newAvail, {avail: true, notified: false}));
    }
  }

  notificationNeeded() {
    let needed = [];
    if (typeof this.availabilities !== 'undefined') {
      needed = this.availabilities.filter((availability) => {
        return availability.avail === true && availability.notified === false; // TODO - Check this is tested correctly
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
    // TODO add test
    return _.map(this.availabilities.filter((availability) => {
      return availability.avail === true && availability.notified === false; // TODO - Check this is tested correctly
    }), (availability) => {
      return new Availability(availability);
    });
  }

  get availabilitiesOld() {
    return _.map(this.availabilities.filter((availability) => {
      return availability.avail === true && availability.notified === true; // TODO - Check this is tested correctly
    }), (availability) => {
      return new Availability(availability);
    });
  }

}

class AvailabilityRequestRepo {
  constructor() {
    this.table = db.table(AvailabilityRequest.tableName());
  }

  find(id) {
    return this.table.find(id).then((resp) => {
      return this.wrapResource(resp);
    });
  }

  create(obj) {
    let id = uuid.v1();
    let insertData = merge({id: id, status: 'active'}, obj);
    return this.table.insert(insertData).then((resp) => {
      return id;
    });
  }

  update(obj) {
    return this.table.update(obj.id, _.omit(obj, 'id'));
  }

  cancel(id) {
    return this.table.update(id, { status: 'canceled' });
  }

  active() {
    return this.table.scan(
      {
        attrsGet: ['id', 'email', 'status', 'dateEnd', 'dateStart', 'daysLength'],
        filters: [
          { column: 'status',     value: 'active'},
          { column: 'dateEnd',   value: moment().unix().toString(), op: 'GE', type: 'N' }
        ]

      }
    ).then((aRequests) => {
        let aRequestsRepo = aRequests.map( aRequest => {
          return this.wrapResource(aRequest);
        });
        return aRequestsRepo.filter((resource) => {
          return resource.checkable();
        });
    });
  }

  updateAvailabilities(availabilityRequest, newAvailabilities) {
    availabilityRequest.mergeAvailabilities(newAvailabilities);
    return this.update(_.merge(availabilityRequest, { checkedAt: moment().unix() }));
  }

  wrapResource(obj) {
    return new AvailabilityRequest(obj);
  }

}

export { AvailabilityRequest, AvailabilityRequestRepo }
