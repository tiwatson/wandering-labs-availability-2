import Aws from 'aws-sdk';
import Promise from 'bluebird';

class NotificationSns {
  constructor(target, message) {
    this.message = message;

    this.sns = new Promise.promisifyAll(new Aws.SNS({
      apiVersion: '2010-03-31',
      region: process.env.AWS_REGION,
    }));

    this.params = {
      TargetArn: process.env.AWS_SNS_NOTIFICATION,
      Message: message,
      MessageStructure: 'string',
    };
  }

  publish() {
    return this.sns.publishAsync(this.params);
  }
}

export { NotificationSns };
