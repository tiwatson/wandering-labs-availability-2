
import moment from 'moment';
import sinon from 'sinon';

import { testHelper, Factory, ModelData } from '../test-helper';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/repos/availability-request';
import { NotificationSns } from '../../src/helpers/notification-sns';

describe('NotificationSns', () => {
  describe('#publish', () => {
    var availabilityRequest;
    var notificationSns;

    let snsResponse =  {
      ResponseMetadata: {
        RequestId: '9d4b41c5-8b44-5c91-9672-0f1df61808ad'
      },
      MessageId: 'd5fb2e77-dd69-5af0-adff-60afa0351ecc'
    };

    beforeEach(() => {
      return Factory.availabilityRequestRepo().then((factoryObj) => {
        availabilityRequest = factoryObj;
        notificationSns = new NotificationSns(availabilityRequest);

        sinon.stub(notificationSns.sns, 'publishAsync').returns(new Promise(resolve=> {resolve(snsResponse)}));
      });
    });

    it('target arn gets set', ()=> {
      expect(notificationSns.params.TargetArn).to.not.be.empty;
    });

    it('includes the availabilityRequest id in the message body', ()=> {
      expect(notificationSns.params.Message).to.not.be.empty;
      expect(notificationSns.params.Message).to.be.equal(availabilityRequest.id);
    });

    it('publishes to amazon', () => {
      return notificationSns.publish().then((response) => {
        expect(response).to.not.be.empty;
        expect(response.MessageId).to.equal(snsResponse.MessageId);
      });
    });
  });
});
