var API = require('../api')
var UrlPattern = require('url-pattern')

var endpoints = {
  pushtx: new UrlPattern('/pushtx')
}

module.exports = createWithApi(API.createUsingNetwork('bitcoin', endpoints))

module.exports.usingNetwork = function (network) {
  return createWithApi(API.createUsingNetwork(network, endpoints))
}

function createWithApi (api) {
  return {
    pushtx: pushtx.bind(null, api)
  }
}

function pushtx (api, txHex, options) {
  return api.post('pushtx', {}, body)
}
