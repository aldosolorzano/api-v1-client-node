var request = require('request-promise')
var q = require('q')
var urljoin = require('url-join')

function API (rootUrl, endpoints) {
  this.rootUrl = rootUrl
  this.endpoints = endpoints
}

API.prototype.request = function (api, options) {
  try {
    var endpoint = this.endpoints[api].stringify(options)
    var apiurl = urljoin(this.rootUrl, endpoint)
    return request(apiurl).then(parseResponse).catch(handleError)
  } catch (err) {
    return q.reject(err)
  }
}

API.prototype.post = function (api, options, body) {
  try {
    var endpoint = this.endpoints[api].stringify(options)
    var apiurl = urljoin(this.rootUrl, endpoint)
    return request({
      method: 'POST',
      url: apiurl,
      body: body,
      json: true
    }).then(parseResponse).catch(handleError)
  } catch (err) {
    return q.reject(err)
  }
}

API.createUsingNetwork = function (network, endpoints) {
  return new API(API.apiUrlForNetwork(network), endpoints)
}

API.apiUrlForNetwork = function (network) {
  switch (network) {
    case 'bitcoin':
      return 'https://blockchain.info'
    case 'testnet':
      return 'https://testnet.blockchain.info'
    case 'litecoin':
      return 'http://litecoin.mifiel.co/api/tx/send'
    case 'litecoin_testnet':
      return 'http://litecoin-testnet.mifiel.co/api/tx/send'
    default:
      throw new Error('Invalid network: ' + network)
  }
}

module.exports = API

function parseResponse (response) {
  try { return JSON.parse(response) } catch (e) { return response }
}

function handleError (e) {
  throw e.error || e || 'Unexpected error'
}
