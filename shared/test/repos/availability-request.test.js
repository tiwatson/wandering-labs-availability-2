
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
      let existingAvails = [{ siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true }];
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      availabilityRequest.mergeAvailabilities([]);

      expect(availabilityRequest.availabilities.length).to.equal(1);
      expect(availabilityRequest.availabilities[0].avail).to.equal(false);
    })


  })

  describe('#notificationNeeded', () => {
    it ('returns false if no available campsites', () => {
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest() );
      expect(availabilityRequest.notificationNeeded()).to.equal(false);
    });

    it ('returns false if no available campsites', () => {
      let existingAvails = [{ siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: false, notified: false }];
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      expect(availabilityRequest.notificationNeeded()).to.equal(false);
    });

    it ('returns true if available campsites', () => {
      let existingAvails = [{ siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false }];
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      expect(availabilityRequest.notificationNeeded()).to.equal(true);
    });

    it ('returns false if available campsites and already notified', () => {
      let existingAvails = [{ siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: true }];
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );
      expect(availabilityRequest.notificationNeeded()).to.equal(false);
    });

  });

});

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
      return Factory.availabilityRequestRepo().then((factoryObj) => {
        arId = factoryObj.id;
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
      return Factory.availabilityRequestRepo().then((factoryObj) => {
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

      return Factory.availabilityRequestRepo(attrs).then((factoryObj) => {
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

      return Factory.availabilityRequestRepo(attrs).then((factoryObj) => {
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

      return Factory.availabilityRequestRepo(attrs).then((factoryObj) => {
        return new AvailabilityRequestRepo().active().then((objs) => {
          expect(objs).to.be.empty;
          expect(objs).to.be.instanceOf(Array);
          expect(objs.length).to.equal(0);
        });
      });
    });
  })

  describe('#updateAvailabilities', ()=> {
    var availabilityRequest, checkedAt;

    beforeEach(() => {
      return Factory.availabilityRequestRepo().then((factoryObj) => {
        availabilityRequest = factoryObj;
        checkedAt = factoryObj.checkedAt;
      })
    })

    it ('updates the resource in the database', () => {
      let newAvails = [
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7 }
      ]
      return new AvailabilityRequestRepo().updateAvailabilities(availabilityRequest, newAvails).then((obj) => {
        return new AvailabilityRequestRepo().find(availabilityRequest.id).then((resource) => {
          expect(resource.availabilities).to.not.be.empty;
          expect(resource.availabilities).to.be.instanceOf(Array);
          expect(resource.availabilities.length).to.equal(1);
          expect(resource.availabilities[0].avail).to.equal(true);

          expect(resource.checkedAt).to.exist;
          expect(resource.checkedAt).to.be.above(checkedAt);
        });
      });
    });

  });

  describe('#notifiedAvailabilities', ()=> {
    var availabilityRequest;

    beforeEach(() => {
      let existingAvails = [{ siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: false, notified: false }];
      return Factory.availabilityRequestRepo({availabilities: existingAvails}).then((factoryObj) => {
        availabilityRequest = factoryObj;
      });
    });

    it ('updates the resource in the database', () => {
      return new AvailabilityRequestRepo().notifiedAvailabilities(availabilityRequest).then((obj) => {
        return new AvailabilityRequestRepo().find(availabilityRequest.id).then((resource) => {
          expect(resource.availabilities).to.not.be.empty;
          expect(resource.availabilities).to.be.instanceOf(Array);
          expect(resource.availabilities.length).to.equal(1);
          expect(resource.availabilities[0].notified).to.equal(true);
        });
      });
    });

  });

});
