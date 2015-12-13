import sinon from 'sinon';
import Promise from 'bluebird';

import { testHelper, Factory, ModelData, Nocks } from '../../shared/test/test-helper';
import { AvailabilityRequest, AvailabilityRequestRepo, AvailabilityRequestFilters } from '../src/shared/repos/availability-request';
import { NotificationsAvailabilities } from '../src/notifications/availabilities';
import { NotificationsWelcome } from '../src/notifications/welcome';

const NotificationClasses = { availabilities: NotificationsAvailabilities, welcome: NotificationsWelcome }

import app from '../src/app';

describe('#handler', ()=> {

  let sandbox;

  beforeEach(()=> {
    sandbox = sinon.sandbox.create();
  });

  afterEach(()=> {
    sandbox.restore();
  });

  it('calls the correct class', ()=> {
    let availabilityRequest = new AvailabilityRequest( ModelData.availabilityRequest() );
    let event = { Records: [ { Sns: { Message: JSON.stringify({id: '1234', type: 'availabilities'}) } } ] };
    let stub = sandbox.stub(AvailabilityRequestRepo.prototype, 'find').onCall(0).returns( Promise.resolve(availabilityRequest) )

    let mock = sandbox.mock(NotificationsAvailabilities.prototype).expects('deliver').once().returns(Promise.resolve({}));
    app.handler(event, testHelper.context).then(()=> {
      mock.verify();
    });


  });
});
