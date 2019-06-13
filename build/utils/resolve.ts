const path = require('path')

const resolve: Function = (dir) => {
  let route = '../..'
  if (/^build$/.test(__dirname)) {
    route = '..'
  }
  return path.join(__dirname, route, dir)
}

module.exports = resolve
