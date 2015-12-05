
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { NotificationsAvailabilities } from '../../src/notifications/availabilities';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('NotificationsAvailabilities', ()=> {
  let notificationsAvailabilities;
  let availabilityRequest;

  before(() => {
    let existingAvails = [
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
      html = notificationsAvailabilities.compileTemplate();
    });

    it('compiles the template', ()=> {
      expect(html).to.include(availabilityRequest.email);
    });

    it('includes the reserve link', ()=> {
      expect(html).to.include('http://www.reserveamerica.com/camping/bahia-honda-sp/r/campsiteDetails.do?siteId=101');
    })

  });

  describe('#deliver', ()=> {
    it('delivers the email', ()=> {
      return notificationsAvailabilities.deliver().then((response)=> {
        expect(response.message).to.equal('success');
      });
    });
  });
});
