const {getUrl} = require('./utils')
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");

function Hitbtc(exchange) {
    this.key = exchange.key
    this.secret = exchange.secret
}
Hitbtc.prototype.setMarket = function setMarket(market) {
    this.market = market
}

Hitbtc.prototype.getAllMarkets = function getAllMarkets() {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getAllMarkets'),
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getCurrencies = function getCurrencies() {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getCurrencies'),
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getTicker = function getTicker(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getTicker'),
        qs: {
            market: this.market || market,            
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getMarket24hSummaries = function getMarketSummaries(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getMarket24hSummaries'),
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getMarket24hSummary = function getMarket24hSummary(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getMarket24hSummary'),
        qs: {
            market: this.market || market,
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getOrderBook = function getOrderBook(market, type) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getOrderBook'),
        qs: {
            market: this.market,
            type: type || 'both',
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getMarketHistory = function getMarketHistory(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getMarketHistory'),
        qs: {
            market: this.market,            
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.buy = function buy(quantity, rate) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'buy'),
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

Hitbtc.prototype.sell = function sell(quantity, rate) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'sell'),
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

Hitbtc.prototype.cancelOrder = function cancelOrder(uuid) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'cancelOrder'),
        qs: {
            apikey: this.key,
            uuid: uuid
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getOpenOrders = function getOpenOrders(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getOpenOrders'),
        qs: {
            apikey: this.key,
            market: this.market || market,
        },
        json: true
    };

    return rp(options)
}


Hitbtc.prototype.withdraw = function withdraw(quantity, address, paymentid) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'withdraw'),
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

Hitbtc.prototype.getBalances = function getBalances() {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getBalances'),
        qs: {
            apikey: this.key,
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getBalance = function getBalance(coin) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getBalance'),
        qs: {
            apikey: this.key,
            currency: coin || this.coin
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getWalletAddress = function getWalletAddress(coin) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getWalletAddress'),
        qs: {
            apikey: this.key,
            currency: coin || this.coin
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getOrder = function getOrder(uuid) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getOrder'),
        qs: {
            uuid: uuid
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getOrderHistory = function getOrderHistory(market) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getOrderHistory'),
        qs: {
            market: market
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.checkOrderStatus = function checkOrderStatus() {

}

module.exports = {
    Hitbtc: Hitbtc
}
