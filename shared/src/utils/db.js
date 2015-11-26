
import dynasty from 'dynasty';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

let endpoint = (process.env.NODE_ENV == 'test' && process.env.CI != true) ? 'http://localhost:8000' : null

const db = dynasty(credentials);

export default db

import { AvailabilityRequest, AvailabilityRequestRepo } from '../repos/availability-request';

class DbHelpers {

  static tableName(name) {
    return name + '.' + process.env.NODE_ENV;
  }

  static create() {
    return db.create(AvailabilityRequest.tableName(), AvailabilityRequest.tableOptions()).then((resp) => {
      console.log('Your table has been created!');
    })
  }

  static drop() {
    return db.drop(AvailabilityRequest.tableName()).then((resp) => {
      console.log('Your table has been dropped!');
    })
  }

  static clean() {
    return db.table(AvailabilityRequest.tableName()).scan().then((resp) => {
      for(let obj of resp) {
        db.table(AvailabilityRequest.tableName()).remove(obj.id);
      }
    });
  }

}

export { DbHelpers }

