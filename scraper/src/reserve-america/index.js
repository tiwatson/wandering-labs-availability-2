import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

import { RaConnection } from './ra-connection';
import { ParseAvailabilities } from './parse-availabilities';
import { FilterAvailabilities } from './filter-availabilities';


class ReserveAmerica {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.raConnection = new RaConnection(this.availabilityRequest.typeSpecific);

    this.dateStart = moment.unix(this.availabilityRequest.dateStart).format('M/D/YYYY');
    this.dateEnd = moment.unix(this.availabilityRequest.dateEnd).format('M/D/YYYY');
  }

  get query() {
    const query = {
      contractCode: this.availabilityRequest.typeSpecific.state,
      parkId: this.availabilityRequest.typeSpecific.parkId,
      siteTypeFilter: 'ALL',
      // availStatus:
      submitSiteForm: true,
      search: 'site',
      campingDate: 'Wed Feb 24 2016',
      lengthOfStay: this.availabilityRequest.lengthOfStay,
      // campingDateFlex:
      currentMaximumWindow: 12,
      contractDefaultMaxWindow: 'MS:24,LT:18,GA:24,SC:13,PA:24',
      stateDefaultMaxWindow: 'MS:24,GA:24,SC:13,PA:24',
      defaultMaximumWindow: 12,
      // loop:
      // siteCode:
      lookingFor: this.availabilityRequest.typeSpecific.siteType,
    };
    const queryFilters = _.pick(this.siteTypeQuery, _.identity);
    return _.merge(query, queryFilters);
  }

  get siteTypeQuery() {
    const typeSpecific = this.availabilityRequest.typeSpecific;
    if (this.availabilityRequest.typeSpecific.siteType === 2001) {
      return {
        camping_2001_moreOptions: true,
        camping_2001_3013: typeSpecific.eqLen,
        camping_2001_218: typeSpecific.electric,
        camping_2001_3006: typeSpecific.water,
        camping_2001_3007: typeSpecific.sewer,
        camping_2001_3008: typeSpecific.pullthru,
        camping_2001_3011: typeSpecific.waterfront,
      };
    } else if (this.availabilityRequest.typeSpecific.siteType === 2002) {
      return {
        camping_2002_moreOptions: true,
        camping_2002_3013: typeSpecific.eqLen,
        camping_2002_218: typeSpecific.electric,
        camping_2002_3006: typeSpecific.water,
        camping_2002_3007: typeSpecific.sewer,
        camping_2002_3008: typeSpecific.pullthru,
        camping_2002_3011: typeSpecific.waterfront,
      };
    } else if (this.availabilityRequest.typeSpecific.siteType === 2003) {
      return {
        camping_2003_moreOptions: true,
        camping_2003_3011: typeSpecific.waterfront,
      };
    } else if (this.availabilityRequest.typeSpecific.siteType === 10001) {
      return {
        camping_10001_moreOptions: true,
        camping_10001_3011: typeSpecific.waterfront,
      };
    }

    return {};
  }

  perform() {
    const lengthOfStay = this.availabilityRequest.lengthOfStay;

    return this.raConnection.setSession().then(() => {
      return this.raConnection.setFilters(this.query);
    }).then(() => {
      return this.allAvailabilities(this.dateStart);
    }).then((returnedAvails) => {
      console.log('returned_avails', returnedAvails.length);
      console.log('returned_avail', returnedAvails[0]);
      const filteredAvail = FilterAvailabilities.filter(moment.unix(this.availabilityRequest.dateEnd), lengthOfStay, returnedAvails);
      return filteredAvail;
    });
  }

  allAvailabilities(firstMoment) {
    const endMoment = moment.unix(this.availabilityRequest.dateEnd);

    const getAvailabilities = (nextMoment) => {
      return new Promise(resolve => {
        return this.raConnection.getNextAvail(nextMoment).then((response) => {
          const foundAvail = new ParseAvailabilities(response.body).parse();
          if (foundAvail.length > 0) {
            // console.log('arrivalDate', foundAvail[0].arrivalDate)
            nextMoment = moment(foundAvail[0].arrivalDate, 'MM/DD/YYYY').add(13, 'days');
            // console.log('nextMoment', nextMoment.format('M/D/YYYY'))
            if (nextMoment.isBefore(endMoment)) {
              getAvailabilities(nextMoment.format('M/D/YYYY')).then((av) => {
                resolve(foundAvail.concat(av));
              });
            } else {
              resolve(foundAvail);
            }
          } else {
            resolve([]);
          }
        });
      });
    };
    return getAvailabilities(firstMoment);
  }
}

export { ReserveAmerica };
