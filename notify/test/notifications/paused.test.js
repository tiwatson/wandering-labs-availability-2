
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { NotificationsPaused } from '../../src/notifications/paused';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('NotificationsPaused', ()=> {
  let notificationsPaused;
  let availabilityRequest;

  before(() => {
    availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({id: '1234-asdf'}) );
    notificationsPaused = new NotificationsPaused(availabilityRequest);

    Nocks.sendgrid();
  });

  describe('#compileTemplate', ()=> {
    let html;

    before(() => {
      html = notificationsPaused._compileTemplate();
      // fs.writeFile('paused.html', html);
    });

    it('compiles the template', ()=> {
      expect(html).to.include(availabilityRequest.typeSpecific.parkName);
    });

    it('includes the unpause link', ()=> {
      expect(html).to.include('http://reserve.wanderinglabs.com/' + availabilityRequest.id + '/unpause');
    })

  });

  describe('#deliver', ()=> {
    it('delivers the email', ()=> {
      return notificationsPaused.deliver().then((response)=> {
        expect(response.message).to.equal('success');
      });
    });
  });
});
