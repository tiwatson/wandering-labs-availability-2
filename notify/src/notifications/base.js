import fs from 'fs';
import Handlebars from 'handlebars';

import { Sendgrid } from '../shared/utils/sendgrid';
import { AvailabilityRequestRepo } from '../shared/repos/availability-request';


class NotificationsBase {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.sendgrid = new Sendgrid();
  }

  deliver() {
    return this.sendgrid.deliver(this._emailParams()).then((response)=> {
      return new AvailabilityRequestRepo().notifiedAvailabilities(this.availabilityRequest).then(() => {
        return response;
      });
    });
  }

  // TODO - refactor out into its own utility
  _compileTemplate() {
    const templateFilename = __dirname + '/../templates/' + this.template;
    const templateFile = fs.readFileSync(templateFilename, { encoding: 'utf8' });
    const compiledTemplate = Handlebars.compile(templateFile);
    return compiledTemplate(this.availabilityRequest);
  }

  _emailParams() {
    return {
      to: this.availabilityRequest.email,
      subject: this.subject,
      html: this._compileTemplate()
    }
  }

}

export { NotificationsBase };
