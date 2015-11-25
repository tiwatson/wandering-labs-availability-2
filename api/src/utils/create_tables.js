
require('dotenv').config({path: '/Users/tiwatson/Development/wandering-labs/wandering-labs-availability-2/.env'});

var credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

var dynasty = require('dynasty')(credentials);

dynasty.create('AvailabilityRequests', { key_schema: { hash: ['id', 'string'] } }).then(function(resp) {
  console.log('Your table has been created!');
});
