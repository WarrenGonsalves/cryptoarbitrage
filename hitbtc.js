const { getUrl } = require('./utils')
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");

function Hitbtc(exchange) {
    this.key = exchange.key
    this.secret = exchange.secret
    this.buyQueue = false
    this.sellQueue = false
    this.auth = "Basic " + new Buffer(this.key + ":" + this.secret).toString("base64")
}
Hitbtc.prototype.setMarket = function setMarket(market) {
    this.market = market
}

Hitbtc.prototype.setCoin = function setCoin(coin) {
    this.coin = coin
}

Hitbtc.prototype.getAllMarkets = function getAllMarkets() {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getAllMarkets'),
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.buy = function buy(data) {
    if (!this.buyQueue) {
        const { quantity, rate } = data
        var options = {
            method: 'POST',
            url: getUrl('hitbtc', 'buy'),
            headers: {
                "authorization": this.auth
            },
            form: {
                symbol: `${this.coin}${this.market}`,
                side: 'buy',
                type: 'limit',
                timeInForce: 'GTC',
                quantity: quantity,
                price: rate
            },
            json: true
        };
        this.buyQueue = !this.buyQueue
        return rp(options)
    }
    else {
        console.log('Waiting for the last queue')
    }

    
}

Hitbtc.prototype.sell = function sell(data) {
    const { quantity, rate } = data
    var options = {
        method: 'POST',
        url: getUrl('hitbtc', 'sell'),
        headers: {
            "authorization": this.auth
        },
        form: {
            symbol: `${this.coin}${this.market}`,
            side: 'buy',
            type: 'limit',
            timeInForce: 'GTC',
            quantity: quantity,
            price: rate
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.withdraw = function withdraw(data) {
    const {coin, quantity, address, paymentId} = data
    var options = {
        method: 'POST',
        url: getUrl('hitbtc', 'withdraw'),
        headers: {
            "authorization": this.auth
        },
        form: {
            currency: coin,
            amount: quantity,
            address: address,
            paymentId: paymentId
        },
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
        headers: {
            "authorization": this.auth
        },
        qs: {
            apikey: this.key,
            market: this.market || market,
        },
        json: true
    };

    return rp(options)
}

Hitbtc.prototype.getBalances = function getBalances() {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getBalances'),
        headers: {
            "authorization": this.auth
        },
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
        headers: {
            "authorization": this.auth
        },
        json: true
    };
    console.log(options)
    return rp(options)
}

Hitbtc.prototype.getDepositAddress = function getBalance(coin) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getDepositAddress') + '/' + coin,
        headers: {
            "authorization": this.auth
        },
        json: true
    };
    console.log(options)
    return rp(options)
}

Hitbtc.prototype.getWalletAddress = function getWalletAddress(coin) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getWalletAddress') + '/' + coin,
        headers: {
            "authorization": this.auth
        },
        json: true
    };
    console.log(options)
    return rp(options)
}

Hitbtc.prototype.getOrder = function getOrder(uuid) {
    var options = {
        method: 'GET',
        url: getUrl('hitbtc', 'getOrder') + '/' + uuid,
        headers: {
            "authorization": this.auth
        },
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
