
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';

import { testHelper, Factory, ModelData, Nocks } from '../../../shared/test/test-helper';
import { NotificationsWelcome } from '../../src/notifications/welcome';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/shared/repos/availability-request'

describe('NotificationsWelcome', ()=> {

  describe('premium member', ()=> {
    let notificationsWelcome;
    let availabilityRequest;

    before(() => {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({id: '1234-asdf', premium: true}) );
      notificationsWelcome = new NotificationsWelcome(availabilityRequest);
    });

    describe('#compileTemplate', ()=> {
      let html;

      before(() => {
        html = notificationsWelcome._compileTemplate();
        //fs.writeFile('welcome.html', html);
      });

      it('compiles the template', ()=> {
        expect(html).to.include(availabilityRequest.typeSpecific.parkName);
      });

      it('includes the view link', ()=> {
        expect(html).to.include('http://reserve.wanderinglabs.com/' + availabilityRequest.id + '/cancel');
      });

      it('adjusts content if you are a premium member', ()=> {
        expect(html).to.include('You are a supporter')
      });

    });

    describe('#deliver', ()=> {
      before(() => {
        Nocks.sendgrid();
      });

      it('delivers the email', ()=> {
        return notificationsWelcome.deliver().then((response)=> {
          expect(response.message).to.equal('success');
        });
      });
    });
  });

  describe('non premium member', ()=> {
    let notificationsWelcome;
    let availabilityRequest;

    before(() => {
      availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest({id: '1234-asdf'}) );
      notificationsWelcome = new NotificationsWelcome(availabilityRequest);
    });

    describe('#compileTemplate', ()=> {
      let html;

      before(() => {
        html = notificationsWelcome._compileTemplate();
        //fs.writeFile('welcome.html', html);
      });

      it('asks you to support', ()=> {
        expect(html).to.include('Help out and become a Premium Member')
      });
    });
  });
});
