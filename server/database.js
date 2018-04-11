const { Pool } = require('pg')

const pool = new Pool({
  database: 'testzilla',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres'
})

pool.query(
  `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (256) NOT NULL
  );`
).catch((e) => setImmediate(() => {
  throw e
}))

pool.query(
  `CREATE TABLE IF NOT EXISTS files(
    id SERIAL PRIMARY KEY,
    path VARCHAR (256) NOT NULL,
    name VARCHAR (54) NOT NULL,
    owner VARCHAR (256) REFERENCES users(email),
    shared_with VARCHAR (256) REFERENCES users(email)
  );`
).catch((e) => setImmediate(() => {
  throw e
}))

pool.query(
  `CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    content VARCHAR (256) NOT NULL,
    sent_by VARCHAR (256) REFERENCES users(email) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`
).catch((e) => setImmediate(() => {
  throw e
}))

module.exports = pool
