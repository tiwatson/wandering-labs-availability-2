
import { testHelper, Factory, ModelData, Nocks } from '../../../../shared/test/test-helper';
import { AvailabilityRequestCreate } from '../../../src/endpoints/availability-requests/create';

describe('AvailabilityRequestCreate', ()=> {

  let availabilityRequestCreate;

  before(() => {
    availabilityRequestCreate = new AvailabilityRequestCreate(ModelData.availabilityRequest());
  });

  describe('#create', ()=> {
    it('creates a new availabilityRequest', ()=> {
      return availabilityRequestCreate.create().then((createdObj) => {
        expect(createdObj.id).to.exist;
        expect(createdObj.status).to.equal('active');
      });
    });
  });


});
