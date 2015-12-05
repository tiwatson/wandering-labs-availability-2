import chai from 'chai';
import fs from 'fs';
import moment from 'moment'
import nock from 'nock';
import querystring from 'querystring';

import db, { DbHelpers } from '../src/utils/db';
import {Factory, ModelData} from './factories';

// nock.recorder.rec();

global.expect = chai.expect;
global.assert = chai.assert;

before(() => {
  return testHelper.resetDb();
})

afterEach(() => {
  return testHelper.resetDb();
})

var testHelper = {}

testHelper.resetDb = function() {
  return DbHelpers.clean();
}

testHelper.context = {
  succeed: function(obj) {
    console.log('context: success', obj)
  }
};

function nockText(filename) {
  const fullFilename = __dirname + '/../../scraper/test/nocks/' + filename + '.html';
  return fs.readFileSync(fullFilename, { encoding: 'utf8' });
}

var Nocks = {};

Nocks.setSession = ()=> {
  return nock('http://www.reserveamerica.com').get('/camping/bahia-honda-sp/r/campgroundDetails.do?contractCode=FL&parkId=281005')
    .reply(200, nockText('setSession') );
};

Nocks.setFilters = (filter)=> {
  return nock('http://www.reserveamerica.com').post('/camping/bahia-honda-sp/r/campgroundDetails.do?contractCode=FL&parkId=281005', querystring.stringify(filter))
    .reply(200, nockText('setFilters') );
};

Nocks.getNextAvail = (nextDate)=> {
  return nock('http://www.reserveamerica.com').get(`/campsiteCalendar.do?page=calendar&contractCode=FL&parkId=281005&calarvdate=${nextDate}&findavail=next`)
    .reply(200, nockText('getNextAvail-' + moment(nextDate, 'M/D/YYYY').format('M-D-YYYY')) );
};

Nocks.setAll = (filter)=> {
  Nocks.setSession();
  Nocks.setFilters(filter);
  Nocks.getNextAvail('12/5/2015');
  Nocks.getNextAvail('12/19/2015');
};

Nocks.sendgrid = ()=> {
  nock('https://api.sendgrid.com:443')
    .filteringRequestBody(() => {
      return '*';
    })
    .post('/api/mail.send.json', '*')
    .reply(200, {"message":"success"});
}

export { testHelper, Factory, ModelData, Nocks }
