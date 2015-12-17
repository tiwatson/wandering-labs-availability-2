import _ from 'lodash';
import moment from 'moment';
require('moment-range');
import Promise from 'bluebird';
import xml2js from 'xml2js';

Promise.promisifyAll(xml2js);

import { Connection } from './connection';

class MaricopaCountyParks {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.connection = new Connection(this.availabilityRequest.typeSpecific);

    this.dateStart = moment.unix(this.availabilityRequest.dateStart).format('M/D/YYYY');
    this.dateEnd = moment.unix(this.availabilityRequest.dateEnd).format('M/D/YYYY');

    this.dateRange = moment.range(moment.unix(this.availabilityRequest.dateStart), moment.unix(this.availabilityRequest.dateEnd));
  }

  perform() {
    return this.connection.setSession().then(() => {
      return this.getAll().then((avails) => {
        console.log('avails', avails);
        return avails;
      });
    });
  }

  getAll() {
    let days = [];
    this.dateRange.by('days', (day) => { days.push(day); });
    console.log('days', days.length)

    return new Promise.map(days, (day) => {
      console.log('day', day.format('M/D/YYYY'));
      return this.connection.getNextAvail(day, day.clone().add(this.availabilityRequest.lengthOfStay, 'd')).then((resp) => {
        return this.filterAvailabilities(resp.body);
      });
    });
  }


  filterAvailabilities(bodyXml) {
    return xml2js.parseStringAsync(bodyXml).then((body) => {
      console.log('body', body.sites.site.length);
      const availSites = _.filter(body.sites.site, (site) => {
        return site.$.avail === '1';
      });
      console.log('availSites', availSites.length);
      return availSites;
    });
  }

}

export { MaricopaCountyParks };
