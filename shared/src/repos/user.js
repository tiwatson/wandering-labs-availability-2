import _ from 'lodash';

class User {
  static isPremium(email) {
    return _.includes((process.env.PREMIUM || '').split(','), email);
  }
}

export { User };
