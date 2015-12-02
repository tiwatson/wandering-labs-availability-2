
import rp from 'request-promise';
import toughCookie from 'tough-cookie';
import cheerio from 'cheerio';
import chai from 'chai';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.32 Safari/537.36'
}

class RaConnection {
  constructor() {
    let j = rp.jar()
    this.rp = rp.defaults({jar: j, headers: headers, followRedirect: true, resolveWithFullResponse: true});
  }

  setSession() {
    let options = {
      url: 'http://www.reserveamerica.com/camping/bahia-honda-sp/r/campgroundDetails.do?contractCode=FL&parkId=281005',
      method: 'GET'
    };

    return this.rp(options).then(function (response) {
      console.log('setSession Statuscode', response.statusCode)
    }).catch(console.error);
  };

  setFilters(filters) {
    let options = {
      url: 'http://www.reserveamerica.com/camping/bahia-honda-sp/r/campgroundDetails.do?contractCode=FL&parkId=281005',
      method: 'POST',
      form: filters
    };

    return this.rp(options).then(function (response) {
      console.log('setFilters Statuscode', response.statusCode);
      // const doc = cheerio.load(response.body);
      // const lengthOfStay = doc('#lengthOfStay').val();
      // console.log('lengthOfStay', lengthOfStay);
      // chai.expect(lengthOfStay).to.equal(filters.lengthOfStay.toString());
    });
  };

  getNextAvail(nextDate) {
    let options = {
      url: `http://www.reserveamerica.com/campsiteCalendar.do?page=calendar&contractCode=FL&parkId=281005&calarvdate=${nextDate}&findavail=next`,
      method: 'GET'
    };

    console.log('getNextAvail', options)
    return this.rp(options);
  }

}

export { RaConnection };
