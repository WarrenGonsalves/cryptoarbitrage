// function arbitrage(sellExchange, buyExchange, coin, buyingRate, sellingRate) {
//     console.log(coin)
//     //const quantity = yield buyExchange.getBalance(coin)
//     console.log(sellExchange.getBalance(coin).then())
//     sellExchange.getBalance(coin).then(function(err, data){
//         console.log(err)
//         console.log(data)
//     })
//     //console.log(quantity)
//     //return quantity
//     return {}

// }

const bittrex = require('./node.bittrex.api');
const BXAPIKEY = process.env.BITTREXKEY;
const BXAPISECRET = process.env.BITTREXSECRET;
const currency = 'ETH'
const coin = 'XRP'
bittrex.options({ 
  'apikey' : BXAPIKEY, 
  'apisecret' : BXAPISECRET, 
  'stream' : false, 
  'verbose' : false, 
  'cleartext' : false 
});
function arbitrage(sellExchange, buyExchange, coin, buyingRate, sellingRate) {
    this.sellExchange = sellExchange
    this.buyExchange = buyExchange
    this.coin = coin
    this.buyingRate = buyingRate
    this.sellingRate = sellingRate
    this.status = 'created'
}

arbitrage.prototype.init = function init(){
    return new Promise((resolve, reject) => {
        buyExchange.getbalance({
            currency: `${coin}`,
        }, function (data, err) {
            console.log("err",err)
            if(err)
                reject(err)
            else
            {
                resolve(data)
            }
            
        });
    });
    
}

arbitrage.prototype.init = function init(){
    return new Promise((resolve, reject) => {
        this.buyExchange.getbalance({
            currency: `${coin}`,
        }, function (data, err) {
            console.log("err",err)
            if(err)
                reject(err)
            else
            {
                resolve(data)
            }
            
        });
    });
    
}

arbitrage.prototype.checkOrderData = function checkOrderData(orderId){
    return new Promise((resolve, reject) => {
        let exchange;
        if(this.status == 'sell')
        {
            exchange = this.sellExchange
        }
        else
        {
            exchange = this.buyExchange
        }
        exchange.getOrder({
            orderId: orderId,
        }, function (data, err) {
            console.log("err",err)
            if(err)
                reject(err)
            else
            {
                resolve(data)
            }
            
        });
    });
    
}
arbitrage.prototype.checkWithdraw = function checkWithdraw(withdrawId){
    return new Promise((resolve, reject) => {
        buyExchange.getWithdraw({
            withdrawId: withdrawId,
        }, function (data, err) {
            console.log("err",err)
            if(err)
                reject(err)
            else
            {
                resolve(data)
            }
            
        });
    });
    
}
module.exports = arbitrage
