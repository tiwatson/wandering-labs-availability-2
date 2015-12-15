import _ from 'lodash';
import Aws from 'aws-sdk';
import Promise from 'bluebird';

class Sns {
  constructor(target) {
    this.sns = new Promise.promisifyAll(new Aws.SNS({
      apiVersion: '2010-03-31',
      region: process.env.AWS_REGION,
    }));

    this.target = target;

    // TODO - Refactor
    let arn = process.env.AWS_SNS_SCRAPER;
    if (target === 'notify') {
      arn = process.env.AWS_SNS_NOTIFY;
    }

    this.params = {
      TargetArn: arn,
      MessageStructure: 'string',
    };
  }

  publish(message) {
    let publishMessage = message;
    if (this.target === 'notify') {
      publishMessage = JSON.stringify(publishMessage);
    }
    return this.sns.publishAsync(_.merge(this.params, { Message: publishMessage })).then((resp) => {
      console.log('sns publish response', resp);
      return new Promise(resolve => { return resolve(resp); });
    });
  }
}

export { Sns };
