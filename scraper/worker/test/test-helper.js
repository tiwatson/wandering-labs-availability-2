
import db, { DbHelpers } from '../src/shared/utils/db';
import moment from 'moment'

before(() => {
  return resetDb();
})

function resetDb() {
  return DbHelpers.drop().then(() => { return DbHelpers.create() })
}

function factory() {
  let dateEnd = moment().add(1, 'M').unix()
  console.log('dateEnd', dateEnd)
  let dateStart = moment().subtract(1, 'M').unix()

  return db.table('AvailabilityRequests').insert(
    {
      "date_end": dateEnd,
      "date_start": dateStart,
      "days_length": "3",
      "email": "tim@example.com",
      "id": "bc25b070-9161-11e5-8cad-55d3b7d975fa",
      "location": {
        "park_id": "281005",
        "state": "FL"
      },
      "site_type": 2001,
      "status": "active"
    }
  )
}


export default {
  resetDb,
  factory
}
