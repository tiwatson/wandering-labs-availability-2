
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { NotificationsAvailabilities } from '../../src/notifications/availabilities';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('NotificationsAvailabilities', ()=> {

  describe('non premium member', ()=> {
    let notificationsAvailabilities;
    let availabilityRequest;

    before(() => {
      let existingAvails = [
        { siteNumber: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 101, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: true }
      ]
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails }) );

      notificationsAvailabilities = new NotificationsAvailabilities(availabilityRequest);

      Nocks.sendgrid();
    });

    describe('#compileTemplate', ()=> {
      let html;

      before(() => {
        html = notificationsAvailabilities._compileTemplate();
        // fs.writeFile('availabilities.html', html);
      });

      it('includes the reserve link', ()=> {
        expect(html).to.include('http://www.reserveamerica.com/camping/bahia-honda-sp/r/campsiteDetails.do?siteId=101');
      });

    });

    describe('#deliver', ()=> {
      it('delivers the email', ()=> {
        return notificationsAvailabilities.deliver().then((response)=> {
          expect(response.message).to.equal('success');
        });
      });
    });
  });


  describe('premium member', ()=> {
    let notificationsAvailabilities;
    let availabilityRequest;

    before(() => {
      let existingAvails = [
        { siteNumber: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 100, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: false },
        { siteId: 101, arrivalDate: moment().unix(), daysLength: 7, avail: true, notified: true }
      ]
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({ availabilities: existingAvails, premium: true }) );

      notificationsAvailabilities = new NotificationsAvailabilities(availabilityRequest);

      Nocks.sendgrid();
    });

    describe('#compileTemplate', ()=> {
      let html;

      before(() => {
        html = notificationsAvailabilities._compileTemplate();
        // fs.writeFile('availabilities.html', html);
      });

      it('not show premium add', ()=> {
        expect(html).to.not.include('Help out and become a Premium Member');
      });

    });

  });

});
