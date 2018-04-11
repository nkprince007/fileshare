const db = require('./database')

const table = process.argv[2]
db.query(`TRUNCATE TABLE ${table};`)
