brew install postgres

brew services start postgres

// open postgres terminal
psql postgres

// create dataarbase
CREATE DATABASE breadcrumbs;

//add role "postgres"
/usr/local/Cellar/postgresql/9.6.2/bin/createuser -s postgres

