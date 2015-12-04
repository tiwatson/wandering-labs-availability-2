import fs from 'fs';
import Handlebars from 'handlebars';

import { Sendgrid } from '../shared/utils/sendgrid';

class NotificationsAvailabilities {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.sendgrid = new Sendgrid();
  }

  deliver() {
    return this.sendgrid.deliver(this.emailParams());
  }

  // private

  // TODO - refactor out into its own utility
  compileTemplate() {
    const templateFilename = __dirname + '/../templates/availabilities.html';
    const template = fs.readFileSync(templateFilename, { encoding: 'utf8' });
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(this.availabilityRequest);
  }

  emailParams() {
    return {
      to: this.availabilityRequest.email,
      subject: 'New Availabilities found',
      html: this.compileTemplate()
    }
  }

}

export { NotificationsAvailabilities }
