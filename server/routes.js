const { Router } = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const db = require('./database')
const utils = require('./utils')
const storage = require('./storage')

const router = new Router()

// Routes
router.get('/', async (req, res) => {
  res.render('index')
})

router.post('/upload', storage.upload.any(), (req, res) => {
  res.status(201).send(req.files)
})

router.get('/download', async (req, res) => {
  if (!req.query.path) res.json({})
  else {
    const filePath = path.resolve(req.query.path)
    console.log(filePath)
    const isFile = (await utils.statAsync(filePath)).isFile()
    if (isFile) res.download(filePath)
    else res.json({error: 'not a file'})
  }
})

router.post('/files', async (req, res) => {
  const { users, files } = req.body
  var errors = []
  users.forEach(async user => {
    files.forEach(async file => {
      try {
        const data = await db.query(
          'SELECT * FROM files WHERE path=$1 AND shared_with=$2;',
          [file.path, user])
        if (data.rowCount === 0) {
          await db.query('INSERT INTO files(owner, path, name, shared_with) VALUES($1, $2, $3, $4);', [req.session.email, file.path, file.name, user])
        }
      } catch (err) {
        errors.push(err.toString())
      }
    })
  })
  res.json({error: errors.join(', ')})
})

router.get('/files', async (req, res) => {
  const result = await utils.getUserFiles(req.session.email)
  res.json(result)
})

router.get('/user', (req, res) => {
  if (req.session.email) {
    res.json({ email: req.session.email })
  } else {
    res.json({})
  }
})

router.post('/logout', (req, res) => {
  if (req.session.email) {
    req.session.destroy()
    res.status(200).json({})
  }
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  db.query('SELECT * FROM users WHERE email=$1 LIMIT 1;', [email])
    .then((data) => {
      if (data.rowCount < 1) {
        res.json({ error: `${email}: No such address registered.` })
        return
      }
      const user = data.rows[0]
      if (!bcrypt.compareSync(password, user.password)) {
        res.json({ error: 'Wrong password' })
        return
      }
      req.session.email = user.email
      res.json({status: 'login successful'})
    }).catch((error) => {
      console.error(error)
      res.json({error: error.toString()})
    })
})

router.get('/users', (req, res) => {
  db.query('SELECT email FROM users;').then((data) => {
    res.json({ users: data.rows })
  })
})

router.post('/signup', (req, res) => {
  const { email, password, cpassword } = req.body
  if (password !== cpassword) {
    res.json({ error: 'Passwords do not match' })
    return
  } else if (password === '' || email === '') {
    res.json({ error: 'Empty email or password' })
    return
  }

  const pwSalt = bcrypt.genSaltSync(10)
  const pwHash = bcrypt.hashSync(password, pwSalt)

  db.query('SELECT email FROM users WHERE email=$1 LIMIT 1;', [email])
    .then((data) => {
      if (data.rowCount > 0) {
        res.json({
          error: `Account already registered under mail: ${email}`
        })
      } else {
        db.query('INSERT INTO users(email, password) VALUES($1, $2);',
          [email, pwHash]
        ).then(() => {
          req.session.email = email
          res.json({status: 'successful user creation'})
        }).catch((error) => {
          console.error(error)
          res.json({error: error.toString()})
        })
      }
    }).catch((error) => {
      console.error(error)
      res.json({error: error.toString()})
    })
})

module.exports = router
