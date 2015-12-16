import moment from 'moment';
import _ from 'lodash';

class FilterAvailabilities {
  static filter(dateEnd, daysLength, avails) {
    const bySiteId = {};
    const siteNumbers = {};

    avails.forEach((avail) => {
      const arrivalDate = moment(avail.arrivalDate, 'M/D/YYYY');
      if (arrivalDate.isBefore(dateEnd)) {
        siteNumbers[avail.siteId] = avail.siteNumber;
        if (typeof bySiteId[avail.siteId] === 'undefined') {
          bySiteId[avail.siteId] = [];
        }
        bySiteId[avail.siteId].push(arrivalDate);
      }
    });

    const groupedAvails = [];
    _.forIn(bySiteId, (days, key) => {
      let firstDay = days[0].clone();

      let currentAvailLength = 0;
      days.forEach((day) => {
        const nextDay = firstDay.clone().add(currentAvailLength, 'd');

        if (nextDay.isSame(day)) {
          currentAvailLength = currentAvailLength + 1;
        } else {
          if (currentAvailLength >= daysLength) {
            groupedAvails.push({ siteId: key, siteNumber: siteNumbers[key], arrivalDate: firstDay.unix(), daysLength: currentAvailLength });
          }
          currentAvailLength = 1;
          firstDay = day;
        }
      });
      if (currentAvailLength >= daysLength) {
        groupedAvails.push({ siteId: key, siteNumber: siteNumbers[key], arrivalDate: firstDay.unix(), daysLength: currentAvailLength });
      }
    });
    return groupedAvails;
  }
}

export { FilterAvailabilities };
