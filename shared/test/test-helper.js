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
  success: function(obj) {
    console.log('context: success', obj)
  }
};

function nockText(filename) {
  const fullFilename = __dirname + '/../../scraper/scrapers/test/nocks/' + filename + '.html';
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
  nock('https://api.sendgrid.com:443', {"encodedQueryParams":true})
    .post('/api/mail.send.json', "to=tiwatson%40gmail.com&from=tiwatson%40gmail.com&subject=Email%20subject&text=Body%20goes%20here")
    .reply(200, {"message":"success"}, { server: 'nginx',
    date: 'Fri, 04 Dec 2015 01:37:15 GMT',
    'content-type': 'application/json',
    'content-length': '21',
    connection: 'close',
    'x-frame-options': 'DENY, DENY',
    'access-control-allow-origin': 'https://sendgrid.com' });
}

Nocks.notificationsAvailabilitySendgrid = ()=> {
  nock('https://api.sendgrid.com:443', {"encodedQueryParams":true})
    .post('/api/mail.send.json', "to=tiwatson%40example.com&subject=New%20Availabilities%20found&html=%0A%0A%0A%3C%21DOCTYPE%20html%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20XHTML%201.0%20Transitional%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FTR%2Fxhtml1%2FDTD%2Fxhtml1-transitional.dtd%22%3E%0A%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%20style%3D%22font-family%3A%20%27Helvetica%20Neue%27%2C%20%27Helvetica%27%2C%20Helvetica%2C%20Arial%2C%20sans-serif%3B%20font-size%3A%20100%25%3B%20line-height%3A%201.6%3B%20margin%3A%200%3B%20padding%3A%200%3B%22%3E%0A%3Chead%3E%0A%20%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%22%20%2F%3E%0A%20%20%3Cmeta%20http-equiv%3D%22Content-Type%22%20content%3D%22text%2Fhtml%3B%20charset%3DUTF-8%22%20%2F%3E%0A%20%20%3Ctitle%3EWandering%20Labs%20Notification%3C%2Ftitle%3E%0A%3C%2Fhead%3E%0A%0A%3Cbody%20style%3D%22font-family%3A%20%27Helvetica%20Neue%27%2C%20%27Helvetica%27%2C%20Helvetica%2C%20Arial%2C%20sans-serif%3B%20font-size%3A%20100%25%3B%20line-height%3A%201.6%3B%20-webkit-font-smoothing%3A%20antialiased%3B%20-webkit-text-size-adjust%3A%20none%3B%20width%3A%20100%25%20%21important%3B%20height%3A%20100%25%3B%20margin%3A%200%3B%20padding%3A%200%3B%20background-color%3A%20%23f6f6f6%3B%22%3E%0A%0A%3C%21--%20body%20--%3E%0A%3Ctable%20style%3D%22width%3A%20100%25%3B%20padding%3A%2020px%3B%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%20style%3D%22padding%3A%2020px%3B%20border%3A%201px%20solid%20%23f0f0f0%3B%20background-color%3A%20%23ffffff%3B%22%3E%0A%0A%20%20%20%20%20%20%3C%21--%20content%20--%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%20600px%3B%20display%3A%20block%3B%20margin%3A%200%20auto%3B%22%3E%0A%20%20%20%20%20%20%3Ctable%20style%3D%22width%3A%20100%25%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ch3%20style%3D%22font-family%3A%20%27Helvetica%20Neue%27%2C%20Helvetica%2C%20Arial%2C%20%27Lucida%20Grande%27%2C%20sans-serif%3B%20color%3A%20%23000%3B%20line-height%3A%201.2%3B%20font-weight%3A%20200%3B%20font-size%3A%2022px%3B%20margin%3A%200%200%2010px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20We%20found%20a%20possible%20campsite...%20Be%20quick%20and%20reserve%20it%20now%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fh3%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cp%20style%3D%22margin-bottom%3A%2010px%3B%20font-weight%3A%20normal%3B%20font-size%3A%2016px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20You%20asked%20us%20to%20look%20for%203%20nights%20sometime%20between%2011%2F03%2F2015%20and%2001%2F03%2F2016.%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fp%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ch4%20style%3D%22font-family%3A%20%27Helvetica%20Neue%27%2C%20Helvetica%2C%20Arial%2C%20%27Lucida%20Grande%27%2C%20sans-serif%3B%20color%3A%20%23000%3B%20line-height%3A%201.2%3B%20%3B%20font-size%3A%2018px%3B%20margin%3A%2010px%200%3B%22%3ENew%20availabilities%3A%3C%2Fh4%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20cellspacing%3D0%20style%3D%22width%3A%20100%25%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3EDate%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3E%23%20Nights%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3ESite%20%23%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3EReserve%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E12%2F03%2F2015%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E7%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E100%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22http%3A%2F%2Freserveamerica.com%22%20style%3D%22color%3A%20%23FFF%3B%20text-decoration%3A%20none%3B%20line-height%3A%202%3B%20font-weight%3A%20bold%3B%20text-align%3A%20center%3B%20cursor%3A%20pointer%3B%20display%3A%20inline-block%3B%20border-radius%3A%2012px%3B%20background-color%3A%20%2377b57a%3B%20margin%3A%203px%200%3B%20border-color%3A%20%2377b57a%3B%20border-style%3A%20solid%3B%20border-width%3A%202px%2012px%3B%22%3EReserve%20Now%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftable%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch4%20style%3D%22font-family%3A%20%27Helvetica%20Neue%27%2C%20Helvetica%2C%20Arial%2C%20%27Lucida%20Grande%27%2C%20sans-serif%3B%20color%3A%20%23000%3B%20line-height%3A%201.2%3B%20%3B%20font-size%3A%2018px%3B%20margin%3A%2010px%200%3B%22%3EPreviously%20notified%20availabilities%2C%20but%20still%20open%3A%3C%2Fh4%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20cellspacing%3D0%20style%3D%22width%3A%20100%25%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3EDate%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3E%23%20Nights%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3ESite%20%23%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22color%3A%20%23a3a3a3%3B%22%3E%3Cb%3EReserve%3C%2Fb%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E12%2F03%2F2015%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E7%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E101%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22http%3A%2F%2Freserveamerica.com%22%20style%3D%22color%3A%20%23FFF%3B%20text-decoration%3A%20none%3B%20line-height%3A%202%3B%20font-weight%3A%20bold%3B%20text-align%3A%20center%3B%20cursor%3A%20pointer%3B%20display%3A%20inline-block%3B%20border-radius%3A%2012px%3B%20background-color%3A%20%2377b57a%3B%20margin%3A%203px%200%3B%20border-color%3A%20%2377b57a%3B%20border-style%3A%20solid%3B%20border-width%3A%202px%2012px%3B%22%3EReserve%20Now%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftable%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cp%20style%3D%22margin-bottom%3A%2010px%3B%20font-weight%3A%20normal%3B%20font-size%3A%2014px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20This%20is%20just%20a%20notification.%20You%20have%20not%20yet%20made%20a%20reservation.%3Cbr%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20Act%20fast%20as%20someone%20else%20may%20reserve%20the%20site%20before%20you%20can.%20%28It%20may%20already%20be%20re-booked%29%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fp%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cp%20style%3D%22margin-bottom%3A%2010px%3B%20font-weight%3A%20bold%3B%20font-size%3A%2016px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22%22%20%20style%3D%22color%3A%20%2377b57a%3B%20text-decoration%3A%20none%3B%20line-height%3A%202%3B%20font-weight%3A%20bold%3B%20cursor%3A%20pointer%3B%22%3EI%20got%20a%20reservation%21%20Stop%20Notifications%3C%2Fa%3E%20%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22%22%20style%3D%22color%3A%20%23a3a3a3%3B%20text-decoration%3A%20none%3B%20line-height%3A%202%3B%20font-weight%3A%20bold%3B%20cursor%3A%20pointer%3B%22%3ENo%20longer%20looking.%20Stop%20Notifications%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fp%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%3C%2Ftable%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3C%21--%20%2Fcontent%20--%3E%0A%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3C%21--%20%2Fbody%20--%3E%0A%0A%3C%21--%20footer%20--%3E%0A%3Ctable%20style%3D%22width%3A%20100%25%3B%20clear%3A%20both%20%21important%3B%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%0A%20%20%20%20%20%20%3C%21--%20content%20--%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22max-width%3A%20600px%3B%20display%3A%20block%3B%20margin%3A%200%20auto%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Ctable%20style%3D%22width%3A%20100%25%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cp%20style%3D%22font-size%3A%2012px%3B%20color%3A%20%23666%3B%20margin-bottom%3A%2010px%3B%20font-weight%3A%20normal%3B%22%3E%3Ca%20href%3D%22%23%22%20style%3D%22color%3A%20%23999%3B%22%3E%3Cunsubscribe%3EStop%20all%20emails%20-%20tiwatson%40example.com%3C%2Funsubscribe%3E%3C%2Fa%3E.%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fp%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%3C%2Ftable%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3C%21--%20%2Fcontent%20--%3E%0A%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3C%21--%20%2Ffooter%20--%3E%0A%0A%3C%2Fbody%3E%0A%3C%2Fhtml%3E%0A&from=tiwatson%40gmail.com")
    .reply(200, {"message":"success"}, { server: 'nginx',
    date: 'Fri, 04 Dec 2015 03:22:32 GMT',
    'content-type': 'application/json',
    'content-length': '21',
    connection: 'close',
    'x-frame-options': 'DENY, DENY',
    'access-control-allow-origin': 'https://sendgrid.com' });
}


export { testHelper, Factory, ModelData, Nocks }
