import fs from 'fs';
import Handlebars from 'handlebars';

import { Sendgrid } from '../shared/utils/sendgrid';
import { AvailabilityRequestRepo } from '../shared/repos/availability-request';

class NotificationsAvailabilities {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.sendgrid = new Sendgrid();
  }

  deliver() {
    return this.sendgrid.deliver(this.emailParams()).then((response)=> {
      return new AvailabilityRequestRepo().notifiedAvailabilities(this.availabilityRequest).then(() => {
        return response;
      });
    });
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
      subject: `Campsite Available: ${this.availabilityRequest.typeSpecific.parkName}`,
      html: this.compileTemplate()
    }
  }

}

export { NotificationsAvailabilities }
