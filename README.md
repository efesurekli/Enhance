npm i

brew install postgres
brew install postgis

psql postgres
CREATE DATABASE YOUR_USERNAME;

in server/
npm run builddb
npm run populatedb

brew services start postgres

// open postgres terminal
psql postgres

// create dataarbase
CREATE DATABASE breadcrumbs;

//add role "postgres"
/usr/local/Cellar/postgresql/9.6.2/bin/createuser -s postgres

