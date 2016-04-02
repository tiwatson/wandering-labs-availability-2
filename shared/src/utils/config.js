require('dotenv').config({ path: __dirname + '/../../.env' });

import moment from 'moment';

class config {
  static scrapeAll() {
    return (parseInt(moment().format('m') / 10) % 2) === 1;
  }
}

export { config };
