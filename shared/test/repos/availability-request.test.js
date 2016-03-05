import _ from 'lodash';
import sinon from 'sinon';
import moment from 'moment';
import Promise from 'bluebird';

import { testHelper, Factory, ModelData } from '../test-helper';
import { AvailabilityRequest, AvailabilityRequestRepo, AvailabilityRequestFilters } from '../../src/repos/availability-request';
import db, { DbHelpers } from '../../src/utils/db';

describe('AvailabilityRequest', () => {
  describe('#description', ()=> {
    let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest() );
    it('includes the email', ()=> {
      expect(availabilityRequest.description).to.contain(availabilityRequest.email);
    });
  });

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
    });

    it ('allows availabilites to remain undefined', ()=> {
      let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest() );
      availabilityRequest.mergeAvailabilities([]);

      expect(availabilityRequest.availabilities).to.be.undefined;
    });
  });

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

  describe('#availabilitiesNew', ()=> {
    it('returns only availabilities with active avails not notified', ()=> {
      const avails = [{ id: 1, avail: true, notified: false, arrivalDate: 0 }];
      const newAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesNew;
      expect(newAvails.length).to.equal(1);
      expect(newAvails[0].id).to.equal(1);
    });

    it('does not return when already notified', ()=> {
      const avails = [{ avail: true, notified: true, arrivalDate: 0 }];
      const newAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesNew;
      expect(newAvails.length).to.equal(0);
    });

    it('does not return when not available', ()=> {
      const avails = [
        { avail: false, notified: false, arrivalDate: 0 },
        { avail: false, notified: true, arrivalDate: 0 }
      ];
      const newAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesNew;
      expect(newAvails.length).to.equal(0);
    });

    it('sorts new availabilities', ()=> {
      const avails = [
        { avail: true, notified: false, arrivalDate: 9 },
        { avail: true, notified: false, arrivalDate: 0 },
        { avail: true, notified: false, arrivalDate: 1 },
        { avail: true, notified: false, arrivalDate: 2 }
      ];
      const sortedAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesNew;
      expect(sortedAvails[0].arrivalDate).to.equal(0);
      expect(sortedAvails[3].arrivalDate).to.equal(9);
    });
  });

  describe('#availabilitiesOld', ()=> {
    it('returns only availabilities with active avails already notified', ()=> {
      const avails = [{ id: 1, avail: true, notified: true, arrivalDate: 0 }];
      const oldAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesOld;
      expect(oldAvails.length).to.equal(1);
      expect(oldAvails[0].id).to.equal(1);
    });

    it('does not return when already not yetnotified', ()=> {
      const avails = [{ avail: true, notified: false, arrivalDate: 0 }];
      expect(new AvailabilityRequest({ availabilities: avails }).availabilitiesOld.length).to.equal(0);
    });

    it('does not return when not available', ()=> {
      const avails = [
        { avail: false, notified: false, arrivalDate: 0 },
        { avail: false, notified: true, arrivalDate: 0 }
      ];
      expect(new AvailabilityRequest({ availabilities: avails }).availabilitiesOld.length).to.equal(0);
    });

    it('sorts old availabilities', ()=> {
      const avails = [
        { avail: true, notified: true, arrivalDate: 9 },
        { avail: true, notified: true, arrivalDate: 0 },
        { avail: true, notified: true, arrivalDate: 1 },
        { avail: true, notified: true, arrivalDate: 2 }
      ];
      const sortedAvails = new AvailabilityRequest({ availabilities: avails }).availabilitiesOld;
      expect(sortedAvails[0].arrivalDate).to.equal(0);
      expect(sortedAvails[3].arrivalDate).to.equal(9);
    });
  });

  describe('#notificationNeeded', ()=> {
    it('returns false if no availabilities', ()=> {
      expect(new AvailabilityRequest({}).notificationNeeded()).to.be.false;
    });

    it('returns false if no availabilities avail', ()=> {
      const avails = [{ avail: false, notified: false }];
      expect(new AvailabilityRequest({ availabilities: avails }).notificationNeeded()).to.be.false;
    });

    it('returns false if already notified', ()=> {
      const avails = [{ avail: true, notified: true }];
      expect(new AvailabilityRequest({ availabilities: avails }).notificationNeeded()).to.be.false;
    });

    it('returns true if availability and not notified', ()=> {
      const avails = [{ avail: true, notified: false }];
      expect(new AvailabilityRequest({ availabilities: avails }).notificationNeeded()).to.be.true;
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
      });
    });

    it('should return a AvailabilityRequest', ()=> {
      return new AvailabilityRequestRepo().find(arId).then((obj) => {
        expect(obj.id).to.equal(arId);
      });
    });

  });

  describe('#cancel', () => {
    var arId;

    beforeEach(() => {
      return Factory.availabilityRequestRepo().then((factoryObj) => {
        arId = factoryObj.id;
      })
    })

    it('should cancel AvailabilityRequest', ()=> {
      return new AvailabilityRequestRepo().cancel(arId).then(() => {
        return new AvailabilityRequestRepo().find(arId).then((obj) => {
          expect(obj.status).to.equal('canceled');
        });
      });
    });

  });

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

    context('with db calls', ()=> {
      var availabilityRequest, checkedAt;

      beforeEach(() => {
        let newAvails = [
          { siteId: 100, arrivalDate: moment().unix(), daysLength: 7 }
        ]

        return Factory.availabilityRequestRepo().then((factoryObj) => {
          checkedAt = factoryObj.checkedAt;
          return new AvailabilityRequestRepo().updateAvailabilities(factoryObj, newAvails).then((obj) => {
            return new AvailabilityRequestRepo().find(factoryObj.id).then((resource) => {
              availabilityRequest = resource;
            });
          });
        });
      });

      it ('updates the resource in the database', () => {
        expect(availabilityRequest.availabilities).to.not.be.empty;
        expect(availabilityRequest.availabilities).to.be.instanceOf(Array);
        expect(availabilityRequest.availabilities.length).to.equal(1);
        expect(availabilityRequest.availabilities[0].avail).to.equal(true);
      });

      it ('updates the checkedAt', ()=> {
        expect(availabilityRequest.checkedAt).to.exist;
        expect(availabilityRequest.checkedAt).to.be.above(checkedAt);
      });

      it ('updates the checkedCount', ()=> {
        expect(availabilityRequest.checkedCount).to.equal(1);
      });

      it ('updates the checkedCount again', ()=> {
        return new AvailabilityRequestRepo().updateAvailabilities(availabilityRequest, []).then((obj) => {
          return new AvailabilityRequestRepo().find(availabilityRequest.id).then((resource) => {
            expect(resource.checkedCount).to.equal(2);
          });
        });
      });

      it ('remains active', ()=> {
        expect(availabilityRequest.status).to.equal('active');
      });
    });

    context('proper unit test', ()=> {
      let sandbox;

      beforeEach(()=> {
        sandbox = sinon.sandbox.create();
      });

      afterEach(()=> {
        sandbox.restore();
      });

      it('marks an existing availability as not avail when updating with no availabilities', ()=> {
        let availabilityRequestRepo = new AvailabilityRequestRepo()
        let existingAvails = [
          { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true }
        ]
        let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ id: 1234, availabilities: existingAvails }) );

        //let existingAvailsFalse = _.merge(existingAvails, { avail: false });
        let mock = sandbox.mock(availabilityRequestRepo.table)
          .expects('update')
          .once()
          .withArgs(1234, sinon.match((obj)=> { return obj.availabilities[0].avail === false; }))
          .returns(Promise.resolve([]));

        return availabilityRequestRepo.updateAvailabilities(availabilityRequest, []);
      });

      it('has no availabilities attribute when updating with no availabilities', ()=> {
        let availabilityRequestRepo = new AvailabilityRequestRepo()
        let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ id: 1234 }) );

        let mock = sandbox.mock(availabilityRequestRepo.table)
          .expects('update')
          .once()
          .withArgs(1234, sinon.match((obj)=> { return _.isArray(obj.availabilities) === false; }))
          .returns(Promise.resolve([]));

        return availabilityRequestRepo.updateAvailabilities(availabilityRequest, []);
      });

      it('status remains active when checkedCount not reached', ()=> {
        let availabilityRequestRepo = new AvailabilityRequestRepo()
        let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ id: 1234, status: 'active', checkedCount: 998 }) );

        let mock = sandbox.mock(availabilityRequestRepo.table)
          .expects('update')
          .once()
          .withArgs(1234, sinon.match((obj)=> { return obj.status === 'active'; }))
          .returns(Promise.resolve([]));

        return availabilityRequestRepo.updateAvailabilities(availabilityRequest, []);
      });

      it('pauses status when checkedCount limit reached', ()=> {
        let availabilityRequestRepo = new AvailabilityRequestRepo()
        let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ id: 1234, status: 'active', checkedCount: 999 }) );

        let mock = sandbox.mock(availabilityRequestRepo.table)
          .expects('update')
          .once()
          .withArgs(1234, sinon.match((obj)=> { return obj.checkedCount === 1000 && obj.status === 'paused'; }))
          .returns(Promise.resolve([]));

        return availabilityRequestRepo.updateAvailabilities(availabilityRequest, []);
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

  describe('#scan', ()=> {
    let sandbox;

    beforeEach(()=> {
      sandbox = sinon.sandbox.create();
    });

    afterEach(()=> {
      sandbox.restore();
    });

    it('makes a db scan call', ()=> {
      let availabilityRequestRepo = new AvailabilityRequestRepo()
      let mock = sandbox.mock(availabilityRequestRepo.table).expects('scan').once().withArgs({ attrsGet: AvailabilityRequest.columns(), filters: AvailabilityRequestFilters.byEmail('test@example.com') }).returns(Promise.resolve([]));

      return availabilityRequestRepo.scan(AvailabilityRequestFilters.byEmail('test@example.com'));
    })

  })

});
