import _ from 'lodash';

class User {
  static isPremium(email) {
    return _.includes((process.env.PREMIUM || '').split(','), email.toLowerCase());
  }
}

export { User };
