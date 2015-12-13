
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { ReserveAmerica } from '../../src/reserve-america/index';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('ReserveAmerica', () => {

  describe('instance methods', () => {
    let reserveAmerica, availabilityRequest;

    before(() => {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({
        dateStart: 1445872639,
        dateEnd: 1453825127
      }) );
      reserveAmerica = new ReserveAmerica(availabilityRequest);
    });

    it('formats dateStart', () => {
      expect(reserveAmerica.dateStart).to.not.be.empty;
      expect(reserveAmerica.dateStart).to.equal('10/26/2015');
    });

    it('formats dateEnd', () => {
      expect(reserveAmerica.dateEnd).to.not.be.empty;
      expect(reserveAmerica.dateEnd).to.equal('1/26/2016');
    });

    it('includes contractCode', () => {
      expect(reserveAmerica.query.contractCode).to.exist;
      expect(reserveAmerica.query.contractCode).to.equal( availabilityRequest.typeSpecific.state );
    });

    it('includes contractCode', () => {
      expect(reserveAmerica.query.lengthOfStay).to.exist;
      expect(reserveAmerica.query.lengthOfStay).to.equal( availabilityRequest.lengthOfStay );
    });

  });

  describe('#perform', () => {

    let reserveAmerica, availabilityRequest;

    before(() => {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({
        dateStart: 1449355849,
        dateEnd: 1453825127
      }) );
      reserveAmerica = new ReserveAmerica(availabilityRequest);

      Nocks.setAll(reserveAmerica.query);
    });

    it('updates', () => {
      reserveAmerica.perform().then((availabilities) => {
        expect(availabilities.length).to.equal(3);
      });
    });
  });

  describe('#query', ()=> {
    it('removes nil/empty filters', ()=> {
      expect(new ReserveAmerica({ typeSpecific: {} }).query.camping_2001_3013).to.not.exist;
    });

    it('adjusts query based on filters', ()=> {
      expect(new ReserveAmerica({ typeSpecific: { siteType: 2001, eqLen: 25 } }).query.camping_2001_3013).to.equal(25);
      expect(new ReserveAmerica({ typeSpecific: { siteType: 2001, eqLen: 25 } }).query.camping_2001_218).to.not.exist;
    });

  });

});
