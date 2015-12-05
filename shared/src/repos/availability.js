import _ from 'lodash';
import moment from 'moment';

class Availability {
  constructor(attributes) {
    _.assign(this, attributes);
  }

  get arrivalDateFormatted() {
    return moment.unix(this.arrivalDate).format('MM/DD/YYYY');
  }

  get reserveUrl() {
    // TODO - Reserve America specific
    return 'http://reserveamerica.com';
  }
}

export { Availability };
