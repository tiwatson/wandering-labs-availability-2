
import moment from 'moment';
import sinon from 'sinon';

import { testHelper, Factory, ModelData } from '../test-helper';
import { AvailabilityRequest, AvailabilityRequestRepo } from '../../src/repos/availability-request';
import { Sns } from '../../src/utils/sns';

describe('Sns', () => {

  var availabilityRequest;
  var snsInstance;

  let snsResponse =  {
    ResponseMetadata: {
      RequestId: '9d4b41c5-8b44-5c91-9672-0f1df61808ad'
    },
    MessageId: 'd5fb2e77-dd69-5af0-adff-60afa0351ecc'
  };

  beforeEach(() => {
    return Factory.availabilityRequestRepo().then((factoryObj) => {
      availabilityRequest = factoryObj;
      snsInstance = new Sns('notify');
    });
  });

  it('target arn gets set', ()=> {
    expect(snsInstance.params.TargetArn).to.not.be.empty;
  });

  describe('#publish', () => {
    it('Calls the amazon sdk', () => {
      let mock = sinon.mock(snsInstance.sns).expects('publishAsync').once().withArgs({
        TargetArn: process.env.AWS_SNS_NOTIFY,
        Message: JSON.stringify({id: availabilityRequest.id, type: 'availabilities'}),
        MessageStructure: 'string',
      });
      snsInstance.publish({id: availabilityRequest.id, type: 'availabilities'});
      mock.verify();
    });

    it('returns the response from sns', ()=> {
      sinon.stub(snsInstance.sns, 'publishAsync').returns(new Promise(resolve=> {resolve(snsResponse)}));

      return snsInstance.publish(availabilityRequest.id).then((response) => {
        expect(response).to.not.be.empty;
        expect(response.MessageId).to.equal(snsResponse.MessageId);
      });
    });
  });
});
