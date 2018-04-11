const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./../webpack.config')
const routes = require('./routes')
const db = require('./database')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
// const ios = require('socket.io-express-session')
const compiler = webpack(config)
const mSession = session({
  secret: 'somerandomseycretvariable',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: true
})
const onlineUsers = {}

app.set('port', process.env.PORT || 8000)
app.set('host', process.env.HOST || 'localhost')
app.set('views', './views')
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

io.use((socket, next) => {
  mSession(socket.request, socket.request.res, next)
})

app.use(mSession)
app.use(routes)
app.use(webpackDevMiddleware(compiler, {publicPath: config.output.publicPath}))
app.use(webpackHotMiddleware(compiler))

io.on('connection', client => {
  const { email } = client.request.session
  console.log(email ? `${email} connected` : 'a user connected')

  client.on('online', async () => {
    onlineUsers[email] = client.id
    console.log(onlineUsers)
    const messages = await db.query(
      'SELECT * FROM messages ORDER BY created_at;')
    io.emit('online', {onlineUsers, messages: messages.rows})
  })

  client.on('disconnect', () => {
    console.log(email ? `${email} disconnected` : 'a user disconnected')
    client.broadcast.emit('logout', email)
  })

  client.on('message', async msg => {
    await db.query('INSERT INTO messages(content, sent_by) VALUES($1, $2)', [msg.content, msg.sent_by])
    io.emit('message', msg)
  })
})

app.get('*', (req, res) => res.redirect(`/?next=${req.path}`))
http.listen(app.get('port'), app.get('host'))
