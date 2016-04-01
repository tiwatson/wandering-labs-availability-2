import { testHelper, Factory, ModelData } from '../test-helper';
import { User } from '../../src/repos/user';

describe('User', () => {
  describe('#isPremium', ()=> {
    it('returns true when it includes the email', ()=> {
      process.env.PREMIUM = 'test@example.com'
      expect(User.isPremium('test@example.com')).to.equal(true);
    });

    it('returns true when string with multiple email includes the email', ()=> {
      process.env.PREMIUM = 'asd@example.net,test@example.com,dddd@example.com'
      expect(User.isPremium('test@example.com')).to.equal(true);
    });

    it('returns false when it does not include the email', ()=> {
      process.env.PREMIUM = 'someotheremail@example.com'
      expect(User.isPremium('test@example.com')).to.equal(false);
    });

    it('returns true when it includes the mixed case email', ()=> {
      process.env.PREMIUM = 'testupper@example.com'
      expect(User.isPremium('testUpper@example.com')).to.equal(true);
    });
  });
});
