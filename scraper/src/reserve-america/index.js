
import moment from 'moment';
import Promise from 'bluebird';

import { RaConnection } from './ra-connection';
import { ParseAvailabilities } from './parse-availabilities';
import { FilterAvailabilities } from './filter-availabilities';


class ReserveAmerica {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.raConnection = new RaConnection(this.availabilityRequest.typeSpecific);

    this.dateStart = moment.unix(this.availabilityRequest.dateStart).format('M/D/YYYY')
    this.dateEnd = moment.unix(this.availabilityRequest.dateEnd).format('M/D/YYYY')

    this.query = {
      contractCode: this.availabilityRequest.typeSpecific.state,
      parkId: this.availabilityRequest.typeSpecific.parkId,
      siteTypeFilter: 'ALL',
      // availStatus:
      submitSiteForm: true,
      search: 'site',
      campingDate: 'Wed Dec 30 2015',
      lengthOfStay: this.availabilityRequest.lengthOfStay,
      // campingDateFlex:
      currentMaximumWindow:12,
      contractDefaultMaxWindow: 'MS:24,LT:18,GA:24,SC:13,PA:24',
      stateDefaultMaxWindow: 'MS:24,GA:24,SC:13,PA:24',
      defaultMaximumWindow:12,
      // loop:
      // siteCode:
      lookingFor: this.availabilityRequest.typeSpecific.siteType,
      // camping_2001_3013:
      // camping_2001_218:
      // camping_2002_3013:
      // camping_2002_218:
      // camping_2003_3012:
      // camping_3100_3012:
      // camping_10001_3012:
      // camping_10001_218:
      // camping_3101_3012:
      // camping_3101_218:
      // camping_9002_3012:
      // camping_9002_3013:
      // camping_9002_218:
      // camping_9001_3012:
      // camping_9001_218:
      // camping_3001_3013:
      // camping_2004_3013:
      // camping_2004_3012:
      // camping_3102_3012:
    };

  }

  perform() {
    let lengthOfStay = this.availabilityRequest.lengthOfStay;

    return this.raConnection.setSession().then((resp) => {
      return this.raConnection.setFilters(this.query);
    }).then((resp) => {
      return this.allAvailabilities(this.dateStart);
    }).then((returned_avails) => {
      let filteredAvail = FilterAvailabilities.filter(lengthOfStay, returned_avails);
      return filteredAvail;
    });
  }

  allAvailabilities(firstMoment) {
    let endMoment = moment.unix(this.availabilityRequest.dateEnd);

    let newlyFoundAvail = []
    let getAvailabilities = (nextMoment) => {
      return new Promise(resolve => {
        return this.raConnection.getNextAvail( nextMoment ).then((response) => {
          let foundAvail = new ParseAvailabilities(response.body).parse();
          if (foundAvail.length > 0) {
            // console.log('arrivalDate', foundAvail[0].arrivalDate)
            let nextMoment = moment(foundAvail[0].arrivalDate, 'MM/DD/YYYY').add(13, 'days');
            // console.log('nextMoment', nextMoment.format('M/D/YYYY'))
            if (nextMoment.isBefore(endMoment)) {
              getAvailabilities(nextMoment.format('M/D/YYYY')).then((av) => {
                resolve(foundAvail.concat(av));
              });
            }
            else {
              resolve(foundAvail);
            }
          }
          else {
            resolve([])
          }
        });
      });
    };

    return getAvailabilities(firstMoment);
  }

};

export { ReserveAmerica };
