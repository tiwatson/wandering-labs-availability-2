import rp from 'request-promise';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.32 Safari/537.36',
};

class Connection {
  constructor(details) {
    const jar = rp.jar();
    this.rp = rp.defaults({ jar, headers, followRedirect: true, resolveWithFullResponse: true });
    this.details = details;
  }

  setSession() {
    const options = {
      url: 'https://maricopacountyparks.org/usery',
      method: 'GET',
    };

    return this.rp(options);
  }

  getNextAvail(startDate, endDate) {
    // https://maricopacountyparks.org/campsites/feed.html?startDate=2016-01-24&endDate=2016-01-30
    const options = {
      url: `https://maricopacountyparks.org/campsites/feed.html?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`,
      method: 'GET',
    };

    console.log('options', options);
    return this.rp(options);
  }

}

export { Connection };
