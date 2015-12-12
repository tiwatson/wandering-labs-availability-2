import sinon from 'sinon';
import Promise from 'bluebird';

import { testHelper, Factory, ModelData, Nocks } from '../../shared/test/test-helper';
import { AvailabilityRequest, AvailabilityRequestRepo, AvailabilityRequestFilters } from '../src/shared/repos/availability-request';
import { NotificationsAvailabilities } from '../src/notifications/availabilities';
import { NotificationsWelcome } from '../src/notifications/welcome';

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
    let event = { Records: [ { Sns: { Message: JSON.stringify({id: 1234, type: 'availabilities'}) } } ] };
    let availabilityRequestRepo = new AvailabilityRequestRepo()
    let stub = sandbox.stub(availabilityRequestRepo, 'find').returns( Promise.resolve(availabilityRequest) );

    let notificationsAvailabilities = new NotificationsAvailabilities(availabilityRequest);
    let mock = sandbox.mock(notificationsAvailabilities).expects('deliver').once().returns(Promise.resolve({}));
    app.handler(event)
    mock.verify();


  });
});
