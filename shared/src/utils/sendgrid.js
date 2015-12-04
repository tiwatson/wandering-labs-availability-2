import _ from 'lodash';
import request from 'request-promise';

class Sendgrid {
  constructor() {
    this.request = request;

    this.options = {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API}`
      },
      method: 'POST',
      url: 'https://api.sendgrid.com/api/mail.send.json'
    };
  }

  deliver(params) {
    return this.request(_.merge(this.options, { form: params })).then((resp)=> {
      return JSON.parse(resp);
    });
  }

}

export { Sendgrid };
