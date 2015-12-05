
import fs from 'fs'
import _ from 'lodash'

import { testHelper, Factory, ModelData } from '../../../shared/test/test-helper';
import { ParseAvailabilities } from '../../src/reserve-america/parse-availabilities';

const RaFixtures = __dirname + '/../../fixtures/has-availabilities.txt';
const hasAvailabilitiesTxt = fs.readFileSync(RaFixtures, { encoding: 'utf8' });


describe('ParseAvailabilities', () => {

  it('matches up site numbers to site id', () => {
    let parseAvailabilities = new ParseAvailabilities(hasAvailabilitiesTxt)
    let siteNumbers = parseAvailabilities.getSiteNumbers();

    expect(_.keys(siteNumbers).length).to.be.equal(25);
    expect(siteNumbers['484']).to.be.equal('077');
  })

  it('parses out availabilities', () => {
    let parseAvailabilities = new ParseAvailabilities(hasAvailabilitiesTxt)

    expect(parseAvailabilities.parse()).to.be.instanceOf(Array);
    expect(parseAvailabilities.parse().length).to.equal(63);
  })

})
