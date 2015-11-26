
import db, { DbHelpers } from '../utils/db';

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

}

class AvailabilityRequestRepo {
  constructor() {
    this.table = db.table(AvailabilityRequest.tableName());
  }

  find(id) {
    console.log('find', id)
    return this.table.find(id).then((resp) => {
      console.log('found', resp);
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
    return this.table.update(obj.id, _.omit(obj, 'id')).then((resp) => {
      console.log('obj updated', resp)
    })
  }

  cancel(id) {
    return this.table.update(id, { status: 'canceled' }).then((resp) => {
      console.log('canceled', resp);
    })
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
    return this.update(availabilityRequest);
  }

  wrapResource(obj) {
    return new AvailabilityRequest(obj);
  }

}

export { AvailabilityRequest, AvailabilityRequestRepo }
