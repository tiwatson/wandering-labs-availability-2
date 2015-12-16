import cheerio from 'cheerio';
import queryString from 'querystring';

class ParseAvailabilities {
  constructor(body) {
    this.body = body;
    this.parsedBody = cheerio.load(this.body);
  }

  getSiteNumbers() {
    const siteNumbers = {};

    this.parsedBody('.siteListLabel > a').each((index, el) => {
      const params = queryString.parse(el.attribs.href.replace(/^.*\?/, ''));
      siteNumbers[params.siteId] = el.children[0].data;
    });
    return siteNumbers;
  }

  parse() {
    const siteNumbers = this.getSiteNumbers();

    const doc = this.parsedBody;

    let avails = [];
    doc('a.avail').each((index, el) => {
      const params = queryString.parse(el.attribs.href.replace(/^.*\?/, ''));
      avails.push({
        siteId: params.siteId,
        siteNumber: siteNumbers[params.siteId],
        arrivalDate: params.arvdate,
      });
    });

    // console.log('Avails:', avails);
    return avails;
  }

}

export { ParseAvailabilities };
