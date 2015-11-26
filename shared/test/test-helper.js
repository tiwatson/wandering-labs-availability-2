
import moment from 'moment'
import chai from 'chai';

import db, { DbHelpers } from '../src/utils/db';

import {Factory, ModelData} from './factories';

global.expect = chai.expect;

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

export { testHelper, Factory, ModelData }
