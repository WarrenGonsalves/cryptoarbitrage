const BITTREX = {
    BASEURL : 'https://bittrex.com/api',
    PUBLICAPIv1: '/v1.1/public',
    PRIVATEAPIv1: '/v1.1',
    MARKETS: '/getmarkets',
    CURRENCIES: '/getcurrencies',
    TICKER: '/getticker',
    MARKETSUMMARIES: '/getmarketsummaries',
    MARKETSUMMARY: '/getmarketsummary',
    ORDERBOOK: '/getorderbook',
    MARKETHISTORY: '/getmarkethistory',
    BUY: '/market/selllimit',
    SELL: '/market/selllimit',
    CANCELORDER: '/market/cancel',
    OPENORDERS: '/market/getopenorders',
    BALANCES: '/account/getbalances',
    BALANCE: '/account/getbalance',
    WALLETADDRESS: '/account/getdepositaddress',
    WITHDRAW: '/account/withdraw',
    ORDER: '/account/getorder',
    ORDERHISTORY: '/account/getorderhistory',
    WITHDRAWHISTORY: '/account/getwithdrawalhistory',
    DEPOSITHISTORY: '/account/getdeposithistory',
}
const HITBTC = {
    BASEURL : 'https://api.hitbtc.com',
    PUBLICAPIv1: '/v1.1/public',
    PRIVATEAPIv1: '/api/2',
    MARKETS: '/getmarkets',
    CURRENCIES: '/getcurrencies',
    TICKER: '/getticker',
    MARKETSUMMARIES: '/getmarketsummaries',
    MARKETSUMMARY: '/getmarketsummary',
    ORDERBOOK: '/getorderbook',
    MARKETHISTORY: '/getmarkethistory',
    BUY: '/order',
    SELL: '/order',
    CANCELORDER: '/market/cancel',
    OPENORDERS: '/market/getopenorders',
    BALANCES: '/account/balance',
    BALANCE: '/account/balance',
    WALLETADDRESS: '/account/crypto/address',
    WITHDRAW: '/account/crypto/withdraw',
    ORDER: '/order',
    ORDERHISTORY: '/account/getorderhistory',
    WITHDRAWHISTORY: '/account/getwithdrawalhistory',
    DEPOSITHISTORY: '/account/getdeposithistory',
}





module.exports = {
    BITTREX : BITTREX,
    HITBTC  : HITBTC
}



