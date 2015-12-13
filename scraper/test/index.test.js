
import moment from 'moment';
import sinon from 'sinon';

import { testHelper, Factory, ModelData, Nocks } from '../../shared/test/test-helper';
import { Scraper } from '../src/index';
import { ReserveAmerica } from '../src/reserve-america/index';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../src/shared/repos/availability-request';
import { Sns } from '../src/shared/utils/sns';

describe('Scraper', () => {
  describe('#scrape', ()=> {
    let availabilityRequest;
    let scraper;

    before(()=> {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({
        id: '123456',
        dateStart: 1449355849,
        dateEnd: 1453825127
      }) );

      scraper = new Scraper(availabilityRequest);

      // TODO - refactor to use sinon
      let reserveAmerica = new ReserveAmerica(availabilityRequest)
      Nocks.setAll(reserveAmerica.query);
    });

    it('calls scrape', ()=> {
      return scraper.scrape().then(() => {
        expect(availabilityRequest.availabilities.length).to.equal(3);
        expect(availabilityRequest.checkedAt).to.be.above(moment().subtract(1, 'm').unix());
      });
    });
  });
});
