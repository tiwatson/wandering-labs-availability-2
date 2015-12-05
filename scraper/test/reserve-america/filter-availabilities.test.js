
import fs from 'fs'
import _ from 'lodash'

import { testHelper, Factory, ModelData } from '../../../shared/test/test-helper';
import { FilterAvailabilities } from '../../src/reserve-america/filter-availabilities';


describe('FilterAvailabilities', () => {

  it('finds no acceptable ranges', () => {
    let toFilter = [
      { siteId: '480', siteNumber: '073', arrivalDate: '5/30/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/1/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/3/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/7/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/9/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/12/2016' }
    ];
    let filterAvailabilities = FilterAvailabilities.filter(3,toFilter)

    expect(filterAvailabilities.length).to.be.equal(0);
  });

  it('filters and groups matching availabilities for single site', () => {
    let toFilter = [
      { siteId: '480', siteNumber: '073', arrivalDate: '5/30/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '5/31/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/1/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/2/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/3/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/4/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/8/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/9/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/12/2016' }
    ];
    let filterAvailabilities = FilterAvailabilities.filter(3,toFilter)

    expect(filterAvailabilities.length).to.be.equal(1);
    expect(filterAvailabilities[0].siteId).to.be.equal('480');
    expect(filterAvailabilities[0].siteNumber).to.be.equal('073');
    expect(filterAvailabilities[0].daysLength).to.be.equal(6);
  });

  it('filters and groups matching availabilities for single site (2 ranges)', () => {
    let toFilter = [
      { siteId: '480', siteNumber: '073', arrivalDate: '5/30/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '5/31/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/1/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/2/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/3/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/7/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/8/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/9/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/12/2016' }
    ];
    let filterAvailabilities = FilterAvailabilities.filter(3,toFilter)

    expect(filterAvailabilities.length).to.be.equal(2);
    expect(filterAvailabilities[0].siteId).to.be.equal('480');
    expect(filterAvailabilities[0].siteNumber).to.be.equal('073');
    expect(filterAvailabilities[0].daysLength).to.be.equal(5);
    expect(filterAvailabilities[1].daysLength).to.be.equal(3);
  });

  it('filters and groups matching availabilities for 2 sites', () => {
    let toFilter = [
      { siteId: '480', siteNumber: '073', arrivalDate: '5/30/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '5/31/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/1/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/2/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/3/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/7/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/8/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/9/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/12/2016' }
    ];
    let filterAvailabilities = FilterAvailabilities.filter(3,toFilter)

    expect(filterAvailabilities.length).to.be.equal(2);
    expect(filterAvailabilities[0].siteId).to.be.equal('480');
    expect(filterAvailabilities[0].siteNumber).to.be.equal('073');
    expect(filterAvailabilities[0].daysLength).to.be.equal(5);
    expect(filterAvailabilities[1].siteId).to.be.equal('500');
    expect(filterAvailabilities[1].siteNumber).to.be.equal('074');
    expect(filterAvailabilities[1].daysLength).to.be.equal(3);
  });

  it('filters and groups matching availabilities for 2 sites (2 ranges)', () => {
    let toFilter = [
      { siteId: '480', siteNumber: '073', arrivalDate: '5/30/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '5/31/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/1/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/2/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/3/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/7/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/8/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/9/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/7/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/8/2016' },
      { siteId: '480', siteNumber: '073', arrivalDate: '6/9/2016' },
      { siteId: '500', siteNumber: '074', arrivalDate: '6/12/2016' }
    ];
    let filterAvailabilities = FilterAvailabilities.filter(3,toFilter)

    expect(filterAvailabilities.length).to.be.equal(3);
    expect(filterAvailabilities[0].siteId).to.be.equal('480');
    expect(filterAvailabilities[0].siteNumber).to.be.equal('073');
    expect(filterAvailabilities[0].daysLength).to.be.equal(5);
    expect(filterAvailabilities[1].siteId).to.be.equal('480');
    expect(filterAvailabilities[1].siteNumber).to.be.equal('073');
    expect(filterAvailabilities[1].daysLength).to.be.equal(3);
    expect(filterAvailabilities[2].siteId).to.be.equal('500');
    expect(filterAvailabilities[2].siteNumber).to.be.equal('074');
    expect(filterAvailabilities[2].daysLength).to.be.equal(3);
  });


})
