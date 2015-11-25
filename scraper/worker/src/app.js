require('dotenv').config({path: '/Users/tiwatson/Development/wandering-labs/wandering-labs-availability-2/.env'});

import { AvailabilityRequest, AvailabilityRequestRepo } from './shared/repos/availability-request'

exports.handler = function(event,context) {
  console.log('app.handler');
  return new AvailabilityRequestRepo().active()
}
