
import moment from 'moment'
import chai from 'chai';

import db, { DbHelpers } from '../src/utils/db';

import {Factory, ModelData} from './factories';

global.expect = chai.expect;

before(() => {
  console.log('before');
  return testHelper.resetDb().then((resp) => { return done(); });
})

afterEach(() => {
  return testHelper.resetDb();
})

var testHelper = {}

testHelper.resetDb = function() {
  console.log('reset..');
  return DbHelpers.drop().then(() => { return DbHelpers.create() })
}

export { testHelper, Factory, ModelData }
