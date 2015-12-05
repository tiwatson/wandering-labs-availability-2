import _ from 'lodash';
import Aws from 'aws-sdk';
import Promise from 'bluebird';

class Sns {
  constructor(target) {
    this.sns = new Promise.promisifyAll(new Aws.SNS({
      apiVersion: '2010-03-31',
      region: process.env.AWS_REGION,
    }));

    // TODO - map target to ARNS
    this.params = {
      TargetArn: process.env.AWS_SNS_SCRAPER,
      MessageStructure: 'string',
    };
  }

  publish(message) {
    return this.sns.publishAsync(_.merge(this.params, { Message: message }));
  }
}

export { Sns };
