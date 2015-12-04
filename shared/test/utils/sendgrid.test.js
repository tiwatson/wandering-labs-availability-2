import nock from 'nock';

import { testHelper, Factory, ModelData, Nocks } from '../test-helper';
import { Sendgrid } from '../../src/utils/sendgrid';

describe('Sendgrid', () => {
  it('sets options on the instance', ()=> {
    let sendgrid = new Sendgrid();

    expect(sendgrid.options).to.not.be.empty;
    expect(sendgrid.options.headers.Authorization.length).to.be.above(10);
    expect(sendgrid.options.url).to.equal('https://api.sendgrid.com/api/mail.send.json');
    expect(sendgrid.options.method).to.equal('POST');
  });

  describe('#deliver', ()=> {
    let emailParams = {
      to: 'tiwatson@gmail.com',
      from: 'tiwatson@gmail.com',
      subject: 'Email subject',
      text: 'Body goes here'
    };

    before(()=> {
      Nocks.sendgrid()
    })

    it('sends an email via request', ()=> {
      return new Sendgrid().deliver(emailParams).then((resp) => {
        expect(resp.message).to.equal('success')
      });
    });
  });
});
