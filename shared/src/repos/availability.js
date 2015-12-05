import _ from 'lodash';
import moment from 'moment';

class Availability {
  constructor(attributes, request) {
    _.assign(this, attributes);
    this.request = request;
  }

  get arrivalDateFormatted() {
    return moment.unix(this.arrivalDate).format('MM/DD/YYYY');
  }

  get reserveUrl() {
    // TODO - Reserve America specific
    let url = 'http://www.reserveamerica.com/camping/' + this.request.typeSpecific.slug + '/r/campsiteDetails.do?siteId=' + this.siteId + '&contractCode=' + this.request.typeSpecific.code + '&parkId=' + this.request.typeSpecific.parkId + '&offset=0&arvdate=' + this.arrivalDateFormatted;
    return url;
  }
}

export { Availability };
