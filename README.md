## Shipping API

### Requirements

1. docker, docker-compose
1. nodejs v18
1. free ports on localhost: 5000, 5432. (if they are busy you would need to change Dockerfile and docker-compose.yaml manually)

### How to run

1. `docker-compose up` brings api service and postgres db in dev mode.
1. by default api will appear on `localhost:5000` (unless you needed to change default ports allocations)

### Seed data

To generate test data you would need to install node modules locally as well. Related code for data generation is in `db-seed.ts` file.

1. make sure that postgres db is running and able to accept connections. (otherwise script would fail, but its fine, you could rerun it).
1. if you use `nvm` you can run `nvm use` and correct node version should be used, otherwise its adviced to use node v18.
1. `npm i` to install modules.
1. `npm run migration:seed` will add data.

### Docs

Basic swagger doc is available at `localhost:5000/docs`.

### Tests

1. `npm t` will run jest unit tests

### N.B.

1. `countries` table should be prefilled with available fo delivery countries. The seed job generates it as well.
2. I had some troubles with stopping api container itself and needed to purge docker data. Hopefully its just my local issue, could not figure it out and didn't want to spend more time on that.
