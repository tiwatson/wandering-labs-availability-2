
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { NotificationsWelcome } from '../../src/notifications/welcome';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('NotificationsWelcome', ()=> {
  let notificationsWelcome;
  let availabilityRequest;

  before(() => {
    availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({id: '1234-asdf'}) );
    notificationsWelcome = new NotificationsWelcome(availabilityRequest);

    Nocks.sendgrid();
  });

  describe('#compileTemplate', ()=> {
    let html;

    before(() => {
      html = notificationsWelcome._compileTemplate();
    });

    it('compiles the template', ()=> {
      expect(html).to.include(availabilityRequest.typeSpecific.parkName);
    });

    it('includes the view link', ()=> {
      expect(html).to.include('http://reserve.wanderinglabs.com/' + availabilityRequest.id + '/cancel');
    })

  });

  describe('#deliver', ()=> {
    it('delivers the email', ()=> {
      return notificationsWelcome.deliver().then((response)=> {
        expect(response.message).to.equal('success');
      });
    });
  });
});
