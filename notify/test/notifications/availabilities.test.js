
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

    Nocks.notificationsAvailabilitySendgrid();
  });

  describe('#compileTemplate', ()=> {
    it('compiles the template', ()=> {
      let html = notificationsAvailabilities.compileTemplate();
      expect(html).to.include(availabilityRequest.email);
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
