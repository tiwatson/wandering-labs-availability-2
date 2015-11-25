runner
-> sends batches to sns
X amount of scrapers get kicked off.
-> work off batch serially

(update DB/notifcations in this lambda or another?) - same one for now. extract out when making 2nd or thrid scraper.


-----------
1. - request - availability-request:id
1. - looks up request
( not required.. could be sent in request)


- send to correct scraper <- how to extract this out to separate lambda
- compile results


- store in DB
- trigger emails or pause request


---------------------
(runs every 5 minutes)

connect to dynmo
find avail_requests that need scraping.
scrape serially as to not overwelm RA
  parse results
  store in db
  trigger notifications
