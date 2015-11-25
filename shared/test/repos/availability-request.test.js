
import moment from 'moment'

import { testHelper, Factory, ModelData } from '../test-helper'
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/repos/availability-request'


describe('AvailabilityRequest', () => {
  describe('#mergeAvailabilities', () => {

    it('adds new availabilities', () => {
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest() );
      let newAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7 }
      ]
      availabilityRequest.mergeAvailabilities(newAvails);

      expect(availabilityRequest.availabilities).to.not.be.empty;
      expect(availabilityRequest.availabilities).to.be.instanceOf(Array);
      expect(availabilityRequest.availabilities.length).to.equal(1);

      expect(availabilityRequest.availabilities[0].avail).to.equal(true);
    })

    it ('ignores existing availabilities', () => {
      let existingAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true }
      ]
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      availabilityRequest.mergeAvailabilities(existingAvails);

      expect(availabilityRequest.availabilities.length).to.equal(1);
      expect(availabilityRequest.availabilities[0].avail).to.equal(true);
    })

    it ('updates existing availabilities to avail: false', () => {
      let existingAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true }
      ]
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      let newAvails = [
        { siteId: 101, arrivalDate: moment().add(1, 'd').unix(), daysLength: 7 }
      ]
      availabilityRequest.mergeAvailabilities(newAvails);

      expect(availabilityRequest.availabilities.length).to.equal(2);
      expect(availabilityRequest.availabilities[0].avail).to.equal(false);
      expect(availabilityRequest.availabilities[1].avail).to.equal(true);
    })

    it ('adds availabilities to existing', () => {
      let existingAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true }
      ]
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      availabilityRequest.mergeAvailabilities([]);

      expect(availabilityRequest.availabilities.length).to.equal(1);
      expect(availabilityRequest.availabilities[0].avail).to.equal(false);
    })


  })
})

describe('AvailabilityRequestRepo', () => {

  describe('#create', () => {
    it ('should insert a new record', () => {
      let availabilityRequest = new AvailabilityRequest({})

      return new AvailabilityRequestRepo().create(availabilityRequest).then((id) => {
        expect(id).to.have.length(36)
      });

    })
  })

  describe('#find', () => {
    var arId;

    beforeEach(() => {
      return Factory.availabilityRequestRepo().then((id) => {
        arId = id;
      })
    })

    it('should return a AvailabilityRequest', ()=> {
      return new AvailabilityRequestRepo().find(arId).then((obj) => {
        expect(obj.id).to.equal(arId);
      })
    })

  })

  describe('#active', () => {

    it('returns an availability request that is active and valid', () => {
      return Factory.availabilityRequestRepo().then((id) => {
        return new AvailabilityRequestRepo().active().then((objs) => {
          expect(objs).to.not.be.empty;
          expect(objs).to.be.instanceOf(Array);
          expect(objs.length).to.equal(1);

          expect(objs[0]).to.be.instanceOf(AvailabilityRequest);
        });
      });
    });

    it('returns empty if AR is out of date range', () => {
      let attrs = {
        dateEnd: moment().subtract(1, 'w').unix()
      }

      return Factory.availabilityRequestRepo(attrs).then((id) => {
        return new AvailabilityRequestRepo().active().then((objs) => {
          expect(objs).to.be.empty;
          expect(objs).to.be.instanceOf(Array);
          expect(objs.length).to.equal(0);
        });
      });
    });

    it('returns empty if AR is not active', () => {
      let attrs = {
        status: 'paused'
      }

      return Factory.availabilityRequestRepo(attrs).then((id) => {
        return new AvailabilityRequestRepo().active().then((objs) => {
          expect(objs).to.be.empty;
          expect(objs).to.be.instanceOf(Array);
          expect(objs.length).to.equal(0);
        });
      });
    });

    it('returns empty if AR end date is closer then days_length', () => {
      let attrs = {
        dateEnd: moment().add(6, 'd').unix(),
        daysLength: 7
      }

      return Factory.availabilityRequestRepo(attrs).then((id) => {
        return new AvailabilityRequestRepo().active().then((objs) => {
          expect(objs).to.be.empty;
          expect(objs).to.be.instanceOf(Array);
          expect(objs.length).to.equal(0);
        });
      });
    });
  })

  describe('#updateAvailabilities', ()=> {
    var arId;

    beforeEach(() => {
      return Factory.availabilityRequestRepo().then((id) => {
        arId = id;
      })
    })

    it ('updates the resource in the database', () => {
      let newAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7 }
      ]
      return new AvailabilityRequestRepo().updateAvailabilities(arId, newAvails).then((obj) => {
        return new AvailabilityRequestRepo().find(arId).then((availabilityRequest) => {
          expect(availabilityRequest.availabilities).to.not.be.empty;
          expect(availabilityRequest.availabilities).to.be.instanceOf(Array);
          expect(availabilityRequest.availabilities.length).to.equal(1);
          expect(availabilityRequest.availabilities[0].avail).to.equal(true);
        })
      });
    })

  })

});
