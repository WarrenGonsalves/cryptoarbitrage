const {getUrl} = require('./utils')
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");

function Bittrex(exchange) {
    this.key = exchange.key
    this.secret = exchange.secret
}
Bittrex.prototype.setMarket = function setMarket(market) {
    this.market = market
}

Bittrex.prototype.getAllMarkets = function getAllMarkets() {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getAllMarkets'),
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getCurrencies = function getCurrencies() {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getCurrencies'),
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getTicker = function getTicker(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getTicker'),
        qs: {
            market: this.market || market,            
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getMarket24hSummaries = function getMarketSummaries(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getMarket24hSummaries'),
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getMarket24hSummary = function getMarket24hSummary(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getMarket24hSummary'),
        qs: {
            market: this.market || market,
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getOrderBook = function getOrderBook(market, type) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getOrderBook'),
        qs: {
            market: this.market,
            type: type || 'both',
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getMarketHistory = function getMarketHistory(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getMarketHistory'),
        qs: {
            market: this.market,            
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.buy = function buy(quantity, rate) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'buy'),
        qs: {
            apikey: this.key,
            market: this.market,
            quantity: quantity,
            rate: rate,
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.sell = function sell(quantity, rate) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'sell'),
        qs: {
            apikey: this.key,
            market: this.market,
            quantity: quantity,
            rate: rate,
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.cancelOrder = function cancelOrder(uuid) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'cancelOrder'),
        qs: {
            apikey: this.key,
            uuid: uuid
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getOpenOrders = function getOpenOrders(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getOpenOrders'),
        qs: {
            apikey: this.key,
            market: this.market || market,
        },
        json: true
    };

    return rp(options)
}


Bittrex.prototype.withdraw = function withdraw(quantity, address, paymentid) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'withdraw'),
        qs: {
            apikey: this.key,
            currency: this.coin,
            quantity: quantity,
            address: address,
            paymentid: paymentid,
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getBalances = function getBalances() {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getBalances'),
        qs: {
            apikey: this.key,
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getBalance = function getBalance(coin) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getBalance'),
        qs: {
            apikey: this.key,
            currency: coin || this.coin
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getWalletAddress = function getWalletAddress(coin) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getWalletAddress'),
        qs: {
            apikey: this.key,
            currency: coin || this.coin
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getOrder = function getOrder(uuid) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getOrder'),
        qs: {
            uuid: uuid
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.getOrderHistory = function getOrderHistory(market) {
    var options = {
        method: 'GET',
        url: getUrl('bittrex', 'getOrderHistory'),
        qs: {
            market: market
        },
        json: true
    };

    return rp(options)
}

Bittrex.prototype.checkOrderStatus = function checkOrderStatus() {

}

module.exports = {
    Bittrex: Bittrex
}
