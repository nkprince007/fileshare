const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const db = require('./database')

const readdirAsync = promisify(fs.readdir)
const statAsync = promisify(fs.stat)

function checkAndCreateFolder (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

function getFolder (email) {
  let dest = 'uploads'
  if (email) {
    dest += '/' + email
  } else {
    dest += '/public'
  }
  checkAndCreateFolder(dest)
  return dest
}

async function getUserFiles (email) {
  const userDir = getFolder(email)
  const publicDir = getFolder()
  var sharedFiles = []
  var owned = (await readdirAsync(userDir)).map(f => {
    return {
      name: f,
      path: path.resolve(userDir, f)
    }
  })
  const publicFiles = (await readdirAsync(publicDir)).map(f => {
    return {
      name: f,
      path: path.resolve(publicDir, f)
    }
  })
  if (email) {
    sharedFiles = (await db.query('SELECT name, path, owner FROM files WHERE shared_with=$1;', [email])).rows
  }
  const publicMap = publicFiles.map(f => f.path)
  owned = owned.filter((v) => {
    return publicMap.indexOf(v.path) < 0
  })
  return {owned, public: publicFiles, shared: sharedFiles}
}

module.exports = {
  checkAndCreateFolder,
  getFolder,
  getUserFiles,
  statAsync,
  readdirAsync
}
