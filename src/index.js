const Config = require('webpack-configurator') // TODO(vjpr): Implement our own.
const main = new Config
main.Config = Config
main.webpackeratorUtils = require('./webpack')
module.exports = main
