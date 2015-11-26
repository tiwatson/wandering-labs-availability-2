
import moment from 'moment';
import promise from 'bluebird';

import { RaConnection } from './ra-connection';
import { ParseAvailabilities } from './parse-availabilities';
import { FilterAvailabilities } from './filter-availabilities';


class ReserveAmerica {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.raConnection = new RaConnection();

    this.dateStart = moment.unix(this.availabilityRequest.dateStart).format('M/D/YYYY')
    this.dateEnd = moment.unix(this.availabilityRequest.dateEnd).format('M/D/YYYY')

    this.query = {
      "contractCode": this.availabilityRequest.typeSpecific.state,
      "parkId": this.availabilityRequest.typeSpecific.parkId,
      "siteTypeFilter": "ALL",
      "availStatus": "",
      "submitSiteForm": true,
      "search": "site",
      "campingDate": "Mon Nov 30 2015",
      "lengthOfStay": this.availabilityRequest.lengthOfStay,
      "campingDateFlex": null,
      "currentMaximumWindow": 12,
      "contractDefaultMaxWindow": 'MS:24,LT:18,GA:24,SC:13,PA:24',
      "stateDefaultMaxWindow": 'MS:24,GA:24,SC:13,PA:24',
      "defaultMaximumWindow": 12,
      "loop": "",
      "siteCode": "",
      "lookingFor": 2001,
      "camping_2003_moreOptions": true,
      "camping_2003_3011": false
    };

  }

  work() {

    let lengthOfStay = this.availabilityRequest.lengthOfStay;

    return this.raConnection.setSession().then((resp) => {
      console.log('setSession responded')
      return this.raConnection.setFilters(this.query).then((resp) => {
        console.log('setFilters responded')

        return this.allAvailabilities(this.dateStart).then((returned_avails) => {
          console.log('total avails', returned_avails);
          let filteredAvail = FilterAvailabilities.filter(lengthOfStay, returned_avails);
          console.log('filteredAvail', filteredAvail)
          //context.done(null, returned_avails);
        })

      })

    })
  }


  allAvailabilities(nextMoment) {
    let endMoment = this.dateEnd;

    return new Promise((resolve) => {
      return this.raConnection.getNextAvail( nextMoment ).then((response) => {
        console.log('getNextAvail', response.statusCode)
        let foundAvail = new ParseAvailabilities(response.body).parse();

        if (foundAvail.length > 0) {
          console.log('arrivalDate', foundAvail[0].arrivalDate)
          let nextMoment = moment(foundAvail[0].arrivalDate, 'MM/DD/YYYY').add(13, 'days');
          console.log('nextMoment', nextMoment.toString())
          if (nextMoment.isBefore(endMoment)) {
            return this.allAvailabilities(nextMoment).then((newlyFoundAvail) => {
              foundAvail = foundAvail.concat(newlyFoundAvail);
              resolve(foundAvail);
            });
          }
          else {
            resolve(foundAvail);
          }
        }
        else {
          resolve([]);
        }
      })

    });
  }

};

export { ReserveAmerica };
