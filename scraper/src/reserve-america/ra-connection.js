import rp from 'request-promise';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.32 Safari/537.36',
};

class RaConnection {
  constructor(raDetails) {
    const jar = rp.jar();
    this.rp = rp.defaults({ jar, headers, followRedirect: true, resolveWithFullResponse: true });
    this.raDetails = raDetails;
    this.campingUrl = `http://www.reserveamerica.com/camping/${raDetails.slug}/r/campgroundDetails.do?contractCode=${raDetails.code}&parkId=${raDetails.parkId}`;
  }

  setSession() {
    const options = {
      url: this.campingUrl,
      method: 'GET',
    };

    return this.rp(options);
  }

  setFilters(filters) {
    const options = {
      url: this.campingUrl,
      method: 'POST',
      form: filters,
    };

    return this.rp(options);
  }

  getNextAvail(nextDate) {
    const options = {
      url: `http://www.reserveamerica.com/campsiteCalendar.do?page=calendar&contractCode=${this.raDetails.code}&parkId=${this.raDetails.parkId}&calarvdate=${nextDate}&findavail=next`,
      method: 'GET',
    };

    return this.rp(options);
  }

}

export { RaConnection };
