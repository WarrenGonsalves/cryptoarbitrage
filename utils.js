
const config = require('./config');

exports.getUrl = function getUrl(exchange, action) {
    if (exchange == 'bittrex' && action == 'getAllMarkets')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.MARKETS
    else if (exchange == 'bittrex' && action == 'getCurrencies')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.CURRENCIES
    else if (exchange == 'bittrex' && action == 'getTicker')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.TICKER
    else if (exchange == 'bittrex' && action == 'getMarket24hSummaries')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.MARKETSUMMARIES
    else if (exchange == 'bittrex' && action == 'getMarket24hSummary')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.MARKETSUMMARY
    else if (exchange == 'bittrex' && action == 'getOrderBook')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.ORDERBOOK
    else if (exchange == 'bittrex' && action == 'getMarketHistory')
        return config.BITTREX.BASEURL + config.BITTREX.PUBLICAPIv1 + config.BITTREX.MARKETHISTORY
    else if (exchange == 'bittrex' && action == 'buy')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.BUY
    else if (exchange == 'bittrex' && action == 'sell')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.SELL
    else if (exchange == 'bittrex' && action == 'cancelOrder')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.CANCELORDER
    else if (exchange == 'bittrex' && action == 'getOpenOrders')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.OPENORDERS
    else if (exchange == 'bittrex' && action == 'getBalances')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.BALANCES
    else if (exchange == 'bittrex' && action == 'getBalance')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.BALANCE
    else if (exchange == 'bittrex' && action == 'getWalletAddress')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.WALLETADDRESS
    else if (exchange == 'bittrex' && action == 'withdraw')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.WITHDRAW
    else if (exchange == 'bittrex' && action == 'getOrder')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.ORDER
    else if (exchange == 'bittrex' && action == 'getOrderHistory')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.ORDERHISTORY
    else if (exchange == 'bittrex' && action == 'getWithdrawalHistory')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.WITHDRAWHISTORY
    else if (exchange == 'bittrex' && action == 'getDepositHistory')
        return config.BITTREX.BASEURL + config.BITTREX.PRIVATEAPIv1 + config.BITTREX.DEPOSITHISTORY


    if (exchange == 'hitbtc' && action == 'getAllMarkets')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.MARKETS
    else if (exchange == 'hitbtc' && action == 'getCurrencies')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.CURRENCIES
    else if (exchange == 'hitbtc' && action == 'getTicker')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.TICKER
    else if (exchange == 'hitbtc' && action == 'getMarket24hSummaries')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.MARKETSUMMARIES
    else if (exchange == 'hitbtc' && action == 'getMarket24hSummary')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.MARKETSUMMARY
    else if (exchange == 'hitbtc' && action == 'getOrderBook')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.ORDERBOOK
    else if (exchange == 'hitbtc' && action == 'getMarketHistory')
        return config.HITBTC.BASEURL + config.HITBTC.PUBLICAPIv1 + config.HITBTC.MARKETHISTORY
    else if (exchange == 'hitbtc' && action == 'buy')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.BUY
    else if (exchange == 'hitbtc' && action == 'sell')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.SELL
    else if (exchange == 'hitbtc' && action == 'cancelOrder')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.CANCELORDER
    else if (exchange == 'hitbtc' && action == 'getOpenOrders')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.OPENORDERS
    else if (exchange == 'hitbtc' && action == 'getBalances')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.BALANCES
    else if (exchange == 'hitbtc' && action == 'getBalance')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.BALANCE
    else if (exchange == 'hitbtc' && action == 'getWalletAddress')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.WALLETADDRESS
    else if (exchange == 'hitbtc' && action == 'withdraw')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.WITHDRAW
    else if (exchange == 'hitbtc' && action == 'getOrder')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.ORDER
    else if (exchange == 'hitbtc' && action == 'getOrderHistory')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.ORDERHISTORY
    else if (exchange == 'hitbtc' && action == 'getWithdrawalHistory')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.WITHDRAWHISTORY
    else if (exchange == 'hitbtc' && action == 'getDepositHistory')
        return config.HITBTC.BASEURL + config.HITBTC.PRIVATEAPIv1 + config.HITBTC.DEPOSITHISTORY

}

