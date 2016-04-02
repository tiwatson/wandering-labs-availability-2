import moment from 'moment';
import Mockdate from 'mockdate';

import { testHelper, Factory, ModelData, Nocks } from '../test-helper';
import { config } from '../../src/utils/config';

describe.only('config', () => {

  after(()=> {
    Mockdate.reset();
  })

  it('scrapeAll is false on 00', ()=> {
    Mockdate.set(new Date('3/3/2000 00:00:00'));
    expect(config.scrapeAll()).to.equal(false);
  });

  it('scrapeAll is true on 10', ()=> {
    Mockdate.set(new Date('3/3/2000 10:10:00'));
    expect(config.scrapeAll()).to.equal(true);
  });

  it('scrapeAll is true on 19', ()=> {
    Mockdate.set(new Date('3/3/2000 19:19:00'));
    expect(config.scrapeAll()).to.equal(true);
  });

  it('scrapeAll is false on 25', ()=> {
    Mockdate.set(new Date('3/3/2000 19:25:00'));
    expect(config.scrapeAll()).to.equal(false);
  });


});
