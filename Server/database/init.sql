/* Set up the database*/

/* Enable postgis*/
CREATE USER enhance_admin PASSWORD '123456' SUPERUSER;
CREATE DATABASE enhance OWNER enhance_admin;
\c enhance enhance_admin
CREATE EXTENSION postgis;
\q
/* Environment Data*/