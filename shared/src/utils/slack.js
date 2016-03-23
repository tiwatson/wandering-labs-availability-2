import _ from 'lodash';
import request from 'request-promise';

class Slack {

  static notify(text) {
    const deliverParams = { payload: `{ "text": "${text}", "channel": "#scraper" }` };

    const options = {
      method: 'POST',
      url: process.env.SLACK_HOOK || 'http://example.com',
    };

    return request(_.merge(options, { form: deliverParams }));
  }

}

export { Slack };
