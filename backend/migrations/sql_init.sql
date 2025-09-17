-- SQL script for PostgreSQL to create the DB (run as a superuser or via psql)
CREATE DATABASE fsic_db;
\c fsic_db;
-- tables will be created by Sequelize, but here's an example schema if you prefer SQL:

CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(60) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  address varchar(400),
  role varchar(20) NOT NULL DEFAULT 'NORMAL_USER',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE stores (
  id serial PRIMARY KEY,
  name varchar(150) NOT NULL,
  email varchar(255),
  address varchar(400),
  owner_id integer REFERENCES users(id),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE ratings (
  id serial PRIMARY KEY,
  score integer NOT NULL CHECK (score >=1 AND score <=5),
  comment varchar(800),
  user_id integer REFERENCES users(id),
  store_id integer REFERENCES stores(id),
  created_at timestamp default now(),
  updated_at timestamp default now()
);
