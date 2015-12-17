
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { MaricopaCountyParks } from '../../src/maricopa-county-parks/index';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('MaricopaCountyParks', () => {

  describe('#perform', () => {

    let maricopaCountyParks, availabilityRequest;

    before(() => {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({
        dateStart: moment().add(6, 'M').unix(),
        dateEnd: moment().add(6, 'M').add(3, 'D').unix(),
      }) );
      maricopaCountyParks = new MaricopaCountyParks(availabilityRequest);

    });

    it('updates', () => {
      return maricopaCountyParks.perform().then((availabilities) => {
        expect(availabilities.length).to.equal(3);
      });
    });
  });
});
