
import dynasty from 'dynasty';

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

let endpoint = (process.env.NODE_ENV === 'test') ? 'http://localhost:8000' : null

const db = dynasty(credentials, endpoint);

export default db

class DbHelpers {

  static create() {
    return db.create('AvailabilityRequests', { key_schema: { hash: ['id', 'string'] } }).then((resp) => {
      //console.log('Your table has been created!');
    })
  }

  static drop() {
    return db.drop('AvailabilityRequests').then((resp) => {
      //console.log('Your table has been dropped!');
    })
  }

}

export { DbHelpers }

