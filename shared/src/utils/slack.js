import _ from 'lodash';
import request from 'request-promise';

class Slack {
  constructor() {
    this.request = request;

    this.options = {
      method: 'POST',
      url: process.env.SLACK_HOOK,
    };
  }

  notify(text) {
    const deliverParams = { payload: `{ "text": "${text}", "channel": "#scraper" }` };
    return this.request(_.merge(this.options, { form: deliverParams }));
  }

}

export { Slack };
