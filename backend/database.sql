CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL 

);

INSERT INTO users(email, passhash) values($1,$2);