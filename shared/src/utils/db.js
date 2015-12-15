import dynasty from 'dynasty';
import Promise from 'bluebird';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_WL,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_WL,
};

const endpoint = ((process.env.NODE_ENV === 'test') && (typeof process.env.CI === 'undefined')) ? 'http://localhost:8000' : null;
const db = dynasty(credentials, endpoint);

export default db;

import { AvailabilityRequest } from '../repos/availability-request';

class DbHelpers {
  static tableName(name) {
    return name + '.' + process.env.NODE_ENV;
  }

  static create() {
    return db.create(AvailabilityRequest.tableName(), AvailabilityRequest.tableOptions()).then(() => {
      console.log('Your table has been created!');
    });
  }

  static drop() {
    return db.drop(AvailabilityRequest.tableName()).then(() => {
      console.log('Your table has been dropped!');
    });
  }

  static clean() {
    return db.table(AvailabilityRequest.tableName()).scan().then((resp) => {
      return Promise.map(resp, (obj) => {
        return db.table(AvailabilityRequest.tableName()).remove(obj.id);
      });
    });
  }
}

export { DbHelpers };
