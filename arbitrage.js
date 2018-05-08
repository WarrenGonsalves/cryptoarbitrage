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
function arbitrage(buyExchange, sellExchange, coin, currency, buyingRate, sellingRate) {
    this.sellExchange = sellExchange
    this.buyExchange = buyExchange
    this.coin = coin
    this.currency = currency
    this.buyingRate = buyingRate
    this.sellingRate = sellingRate
    this.status = 'created'
}

arbitrage.prototype.init = function init(){
    console.log('Balance request sent')
    return new Promise((resolve, reject) => {
        console.log( "this.buyExchange.constructor.name")
        console.log( this.buyExchange.constructor.name)
        if(this.buyExchange.constructor.name == 'Hitbtc')
        {
            console.log( "this.buyExchange.getBalance()")
            this.buyExchange.getBalance().then((wallets) =>{
                let data;
                wallets.forEach(wallet => {
                    if(wallet.currency == this.currency)
                        data = wallet
                });
                console.log(data)
                console.log(`Balance request for ${data.currency} is`,data.available)
                resolve(data.available)
                
            }).catch((err) =>{
                console.log(err)
                reject(err)
            });
        }
        else {
            this.buyExchange.getbalance({
                currency: `${this.currency}`,
            }, function (data, err) {
                console.log(data)
                console.log(`Balance request for ${data.result.Currency} is`,data.result.Available)
                if(err)
                    reject(err)
                else
                {
                    resolve(data.result.Available)
                }
                
            });
        }
        
    });
    
}

arbitrage.prototype.checkOrderData = function checkOrderData(orderId){
    return new Promise((resolve, reject) => {
        let exchange;
        if(this.status == 'sell')
        {
            exchange = this.sellExchange
            console.log("arbitrage sell order status function called for",orderId)
        }
        else
        {
            exchange = this.buyExchange
            console.log("arbitrage buy order status function called for",orderId)
        }
        
        exchange.getorder({
            uuid: orderId,
        }, function (data, err) {
            if(err)
                reject(err)
            else if(data)
            {
                console.log("checking the order status", data.result.OrderUuid)
                resolve(data.result)
            }
            
        });
    });
    
}
arbitrage.prototype.withdraw = function withdraw(withdrawId){
    return new Promise((resolve, reject) => {
        let exchange;
        if(this.status == 'sold')
        {
            exchange = this.sellExchange
            console.log(`withdrawing ${coin} from ${this.sellExchange.constructor.name} initiated`)
        }
        else
        {
            exchange = this.buyExchange
            console.log(`withdrawing ${coin} from ${this.buyExchange.constructor.name} initiated`)
        }
        exchange.withdraw({
            currency: this.currency,
            quantity: this.quantity,
            address: this.exchange.getAddress
        }, function (data, err) {
            console.log("err", err)
            console.log("data",data)
            if (err)
                reject(err)
            else
                resolve(data)

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
