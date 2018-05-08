var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");
// var currency = 'ETH';
// var currencyHitbtc = 'USD';
const { Bittrex: BX } = require('./bittrex')
const { Hitbtc } = require('./hitbtc')
const Arbitrage = require('./arbitrage')

const bittrex = require('./node.bittrex.api');

var coins = [{
	coin: 'XRP',
	currBittrex: 'USDT',
	currHitbtc: 'USDT',
	arbitrageRate: 2
}, {
	coin: 'ETH',
	currBittrex: 'USDT',
	currHitbtc: 'USD',
	arbitrageRate: 2
}, {
	coin: 'NEO',
	currBittrex: 'USDT',
	currHitbtc: 'USD',
	arbitrageRate: 2
}, {
	coin: 'LTC',
	currBittrex: 'USDT',
	currHitbtc: 'USD',
}, {
	coin: 'XRP',
	currBittrex: 'ETH',
	currHitbtc: 'ETH',
	arbitrageRate: 2
}, {
	coin: 'XEM',
	currBittrex: 'ETH',
	currHitbtc: 'ETH',
	arbitrageRate: 2
}]
const fs = require('fs');
const moment = require('moment');

const APIKEY = process.env.BITTREXKEY;
const APISECRET = process.env.BITTREXSECRET;
let arbitrageQueue = [];
let tradingQueue = [];
let totalXRPQuantity = 53;

const BXAPIKEY = process.env.BITTREXKEY;
const BXAPISECRET = process.env.BITTREXSECRET;
const HBTCAPIKEY = process.env.HITBTCKEY;
const HBTCAPISECRET = process.env.HITBTCSECRET;
const hc = new Hitbtc({
	key: HBTCAPIKEY,
	secret: HBTCAPISECRET
})
bittrex.options({
	'apikey': BXAPIKEY,
	'apisecret': BXAPISECRET,
	'stream': false,
	'verbose': false,
	'cleartext': false
});
const exchange = {
	bittrex: bittrex,
	hitbtc: hc,
};
//console.log(hc.getWalletAddress('XRP'));


(function myLoop(i) {
	setTimeout(function () {
		let count = i - 1;
		let cronPattern = (i - 1);
		while (count < 60) {
			cronPattern += ',' + count;
			count += 5;
		}
		//  	try {
		//   new CronJob(cronPattern + ' * * * * *', function() {
		//       console.log('this should not be printed');
		//     })
		// } catch(ex) {
		//     console.log("cron pattern not valid");
		// }
		//console.log(cronPattern);          //  your code here                
		if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
		new CronJob({
			cronTime: cronPattern + ' * * * * *',
			onTick: function () {
				var coin = coins[i];
				// console.log(coin + 'ETH cron');
				var a = getBittrixOrderBook(coin);
				var b = getHitbtcOrderBook(coin);
				// var c = getBittrixLastTrade();
				// var d = getHitbtcLastTrade();
				executeTrade(0.001100, 5, 0.001100, 5)
				//arbitrageCall('bittrex', 'hitbtc', 'XRP', 'ETH', 0.00117896, 0.00001)
				compareRates([a, b], coin);
			},
			start: true,
			runOnInit: true
		});

	}, 1000)
})(coins.length);                        //  pass the number of iterations as an argument

// var job1 = new CronJob({
// 	cronTime: '*/5 * * * * *',
// 	onTick: function() {
// 	  var coin = 'XRP'
// 	  console.log(coin + 'ETH cron');
// 	  var a = getBittrixOrderBook(coin);
// 	  var b = getHitbtcOrderBook(coin);
// 		// var c = getBittrixLastTrade();
// 		// var d = getHitbtcLastTrade();
// 	  compareRates([a, b],coin);
// 	},
// 	start: true,
// 	runOnInit:true
// });

// var job2 = new CronJob({
// 	cronTime: '*/6 * * * * *',
// 	onTick: function() {
// 	  var coin = 'ZEC'
// 	  console.log(coin + 'ETH cron');
// 	  var a = getBittrixOrderBook(coin);
// 	  var b = getHitbtcOrderBook(coin);
// 		// var c = getBittrixLastTrade();
// 		// var d = getHitbtcLastTrade();
// 	  compareRates([a, b],coin);
// 	},
// 	start: true,
// 	runOnInit:true
// });



// bittrex.websockets.client(function() {
//   console.log('Websocket connected');
//   bittrex.websockets.subscribe(['BTC-ETH'], function(data) {
//     if (data.M === 'updateExchangeState') {
//       data.A.forEach(function(data_for) {
//         console.log('Market Update for '+ data_for.MarketName, data_for);
//       });
//     }
//   });
// });

function compareRates(promiseList, pair, callback) {

	Promise.all(promiseList)
		.then(function (data) {
			let log = '\n' + moment().format('HH:mm:ss') + ',';
			// console.log("Bittrex OrderBook ", data[0].result.sell[0])
			log += data[0].result.buy[0].Quantity + ',' + data[0].result.buy[0].Rate + ',' + data[0].result.sell[0].Quantity + ',' + data[0].result.sell[0].Rate;

			// console.log("Hitbtc OrderBook ", data[1].bid[0])
			log += ',' + data[1].bid[0].size + ',' + data[1].bid[0].price + ',' + data[1].ask[0].size + ',' + data[1].ask[0].price;


			//  if (data[2]) {
			//  	console.log("---- Last Trade ----")
			// console.log("bittrex ",data[2].result[0].Price, data[2].result[0].OrderType)
			//   // console.log(data[2])
			// console.log("hitbtc ",data[3][0].price, data[3][0].side)	
			//  }

			// console.log( parseFloat(data[1].bid[0].price), data[0].result.sell[0].Rate );
			// console.log("---- Arbit ----")
			if (pair.coin == 'XRP' && pair.currBittrex == 'ETH') {
				console.log("-----Bittrex----- -----HitBTC-----")
				console.log(pair.coin + pair.currBittrex, data[0].result.sell[0].Rate * 100000, pair.coin + pair.currHitbtc, parseFloat(data[1].bid[0].price) * 100000)
			}

			// console.log("bittrex ", parseFloat(data[1].bid[0].price))
			// console.log("hitbtc ", data[0].result.sell[0].Rate)
			let arbitBittHit = [(parseFloat(data[1].bid[0].price) / data[0].result.sell[0].Rate) * 100 - 100];
			let diffBittHit = parseFloat(data[1].bid[0].price) - data[0].result.sell[0].Rate;
			let arbitHitBitt = [(data[0].result.buy[0].Rate / parseFloat(data[1].ask[0].price)) * 100 - 100];
			let diffHitBitt = data[0].result.buy[0].Rate - parseFloat(data[1].ask[0].price);
			log += ',' + arbitBittHit + '%,' + diffBittHit + ',' + arbitHitBitt + '%,' + diffHitBitt;
			//console.log(pair, 'arbitBittHit',arbitBittHit,'diffBittHit',diffBittHit, 'arbitHitBitt', arbitHitBitt, 'diffHitBitt', diffHitBitt)
			writeToLog(pair.coin + 'BittrexHitbtc.txt', log);
			// console.log(arbit)
		})
		.catch(function (err) {
			console.log(err)
		});
}

function getBittrixOrderBook(pair) {
	var options = {
		method: 'GET',
		url: 'https://bittrex.com/api/v1.1/public/getorderbook',
		qs: { type: 'both', market: `${pair.currBittrex}-${pair.coin}` },
		json: true
	};

	return rp(options)

}


function getHitbtcOrderBook(pair) {
	var options = {
		method: 'GET',
		url: `https://api.hitbtc.com/api/2/public/orderbook/${pair.coin}${pair.currHitbtc}`,
		json: true
	};

	return rp(options)

}

function getBittrixLastTrade(pair) {
	var options = {
		method: 'GET',
		url: 'https://bittrex.com/api/v1.1/public/getmarkethistory',
		qs: { market: `${pair.currBittrex}-${pair.coin}` },
		json: true
	};

	return rp(options)

}


function getHitbtcLastTrade(pair) {
	console.log('hitbtc last')
	var options = {
		method: 'GET',
		url: `https://api.hitbtc.com/api/2/public/trades/${pair.coin}${pair.currHitbtc}?sort=DESC`,
		json: true
	};

	return rp(options)

}

function executeTrade(buyRate, buyQuantity, sellRate, sellQuantity) {
	if (typeof tradingQueue[0] === 'undefined')
		console.log('Trade started')
	else
		console.log('Trade is at status',tradingQueue[0].status)
	if (typeof tradingQueue[0] === 'undefined') {
		const trading = {
			buyStatus: false,
			sellStatus: false,
			status: 'init'
		}
		tradingQueue.push(trading)
		// bittrex.buylimit({
		// 	market: 'ETH-XRP',
		// 	quantity: buyQuantity,
		// 	rate: buyRate
		// }, function (data, err) {
		// 	if (!err) {
		// 		console.log(data.result.uuid);
		// 		tradingQueue[0].buyOrderId = data.result.uuid

		// 	}
		// 	console.log(err);
		// });
		hc.setMarket('ETH')
		hc.setCoin('XRP')
		hc.sell({
			quantity: sellQuantity,
			rate: sellRate
		}).then(function (data) {
			console.log(data)
			tradingQueue[0].sellOrderId = data.clientOrderId
			hc.buyQueue = false
		}).catch(function (err) {
			if (err) {
				console.log(err.message)
			}
		})
		console.log("Buy and sell order are placed")
	} else if (tradingQueue[0].status == 'init') {
		
		// bittrex.getorder({
		// 	uuid: tradingQueue[0].buyOrderId,
		// }, function (data, err) {
		// 	if (err)
		// 		console.log(err)
		// 	else if (data) {
		// 		if (data.result.IsOpen == false) {
		// 			tradingQueue[0].buyPrice = data.result.Price
		// 			tradingQueue[0].buyQuantity = data.result.Quantity
		// 			tradingQueue[0].buyStatus = true;
		// 			console.log(`Successful buy at ${data.result.Price} for ${data.result.Quantity}`)
		// 		}
		// 		else
		// 			console.log('Polling for buy order. Current status is', data.result.IsOpen)

		// 	}

		// });
		hc.getOrder({
			uuid: tradingQueue[0].sellOrderId,
		}).then(function (data) {
			console.log(data)
			if (data.status == 'filled') {
				tradingQueue[0].sellPrice = data.price
				tradingQueue[0].sellQuantity = data.quantity
				tradingQueue[0].sellStatus = true;
				console.log(`Successful sell at ${data.price} for ${data.quantity}`)
			}
			else {
				console.log('Polling for sell order. Current status is', data.status)
			}

		}).catch(function (err) {
			if (err) {
				console.log(err.message)
			}
		})

	} else if (tradingQueue[0].buyStatus && tradingQueue[0].sellStatus && tradingQueue[0].status !== 'withdraw') {
		tradingQueue[0].status = 'withdraw'
		console.log('Starting withdraw process for both exchange')
		bittrex.withdraw({
			currency: 'XRP',
			quantity: tradingQueue[0].buyQuantity,
			address: 'rhL5Va5tDbUUuozS9isvEuv7Uk1uuJaY1T',
			paymentId: '2728919230'
		}, function (data, err) {
			if (!err) {
				console.log("withdraw request send to ", arbitrageQueue[i].withdraw.address)
				console.log(data)
				arbitrageQueue[i].status = 'withdraw'
				arbitrageQueue[i].withdrawId = data.result.uuid
			}
			else
				console.log('Withdraw err', err)
		});
		hc.withdraw({
			coin: 'ETH',
			quantity: tradingQueue[0].sellQuantity,
			address: '0x4f89c376abec84c7d10f9de964cc1b131cff4450',
			paymentId: 42323
		}).then(function (data) {
			console.log(data)
			if (data.status == 'filled') {
				tradingQueue[0].sellPrice = data.price
				tradingQueue[0].sellQuantity = data.quantity
				tradingQueue[0].sellStatus = true;
				console.log(`Successful sell at ${data.price} for ${data.quantity}`)
			}
			else {
				console.log('Polling for sell order. Current status is', data.status)
			}

		}).catch(function (err) {
			if (err) {
				console.log(err.message)
			}
		})

	}
}

function arbitrageCall(buyExchange, sellExchange, coin, currency, buyRate, sellRate) {
	const i = 0
	//console.log('typeof arbitrageQueue[i]', typeof arbitrageQueue[i])
	if (typeof arbitrageQueue[i] === 'undefined') {
		const arbitrage = new Arbitrage(exchange[buyExchange], exchange[sellExchange], coin, currency, buyRate, sellRate)
		arbitrageQueue.push(arbitrage)
		arbitrage.init().then(function (data) {
			console.log(`${currency}-${coin}`, `buy request started for ${data / buyRate} quantity of ${coin} at rate ${buyRate}`)
			return new Promise((resolve, reject) => {
				arbitrage.buyExchange.buylimit({
					market: `${currency}-${coin}`,
					//quantity: data/buyRate,
					quantity: 15,
					rate: buyRate
				}, function (data, err) {
					if (err)
						console.log(err)
					else {
						console.log(`${currency}-${coin}`, `buy request successfully`)
						resolve(data.result.uuid)
					}

				});
			});
		})
			.then(function (data) {
				console.log("arbitrage stage two")
				console.log('order placed. id ', data)
				arbitrage.status = 'init'
				arbitrage.lastOrderId = data
			}).catch(function (err) {
				console.log("arbitrage stage one error in pipeline")
				console.log(err)
			})
	}
	else if (arbitrageQueue[i].status === 'init') {
		arbitrageQueue[i].checkOrderData(arbitrageQueue[i].lastOrderId)
			.then(function (data) {
				console.log(data)
				if (data.IsOpen == false) {
					console.log("arbitrage stage third - get withdraw address started for", data.Quantity)
					//console.log(data)				
					//arbitrageQueue[i].withdrawId = data.resul.OrderUuid
					arbitrageQueue[i].withdraw = {
						quantity: 12
					}
					arbitrageQueue[i].sellExchange.getWalletAddress(arbitrageQueue[i].coin)
						.then((data) => {
							console.log(data)
							console.log("arbitrage stage four - got withdraw address", arbitrageQueue[i].status)
							arbitrageQueue[i].status = 'bought'
							arbitrageQueue[i].withdraw.address = data.address
							if (data.paymentId)
								arbitrageQueue[i].withdraw.paymentId = data.paymentId
							else
								arbitrageQueue[i].withdraw.paymentId = 353222
						})
				}

			}).catch(function (err) {
				console.log("arbitrage stage two error in pipeline")
				//console.log(err)
			})
	}
	else if (arbitrageQueue[i].status === 'bought') {
		console.log("arbitrage stage five - start withdraw request to", arbitrageQueue[i].status)
		console.log(arbitrageQueue[i].withdraw)
		console.log({
			currency: `${arbitrageQueue[i].coin}`,
			quantity: arbitrageQueue[i].withdraw.quantity,
			address: arbitrageQueue[i].withdraw.address,
			paymentId: arbitrageQueue[i].withdraw.paymentId,
		})

		arbitrageQueue[i].buyExchange.withdraw({
			// currency: `${arbitrageQueue[i].coin}`,
			// quantity: arbitrageQueue[i].withdraw.quantity,
			// address: arbitrageQueue[i].withdraw.address,
			// paymentId: arbitrageQueue[i].withdraw.paymentId,
			currency: 'XRP',
			quantity: 12,
			address: 'rhL5Va5tDbUUuozS9isvEuv7Uk1uuJaY1T',
			paymentId: '2728919230'
		}, function (data, err) {
			if (!err) {
				console.log("arbitrage stage six - withdraw request send to ", arbitrageQueue[i].withdraw.address)
				console.log(data)
				arbitrageQueue[i].status = 'withdraw'
				arbitrageQueue[i].withdrawId = data.result.uuid
			}
			else
				console.log('Withdraw err', err)
		});
	}
	else if (arbitrageQueue[i].status === 'withdraw') {
		arbitrageQueue[i].checkWithdraw(arbitrageQueue[i].withdrawId).then(function (data) {
			if (data == true) {
				return new Promise((resolve, reject) => {
					arbitrageQueue[i].sellExchange.sell({
						market: `${arbitrageQueue[i].coin}${arbitrageQueue[i].currency}`,
						quantity: 10,
						rate: 0.00125477
					}, function (data, err) {
						console.log("err", err)
						if (err)
							console.log(err)
						else
							resolve(data)

					});
				});
			}

		}).then(function (data) {
			console.log(data)
			arbitrageQueue[i].lastOrderId = data.result.uuid
			arbitrage.status = 'sell'
		})
	}
	else if (arbitrageQueue[i].status === 'sell') {
		arbitrageQueue[i].checkOrderData(arbitrageQueue[i].lastOrderId).then(function (data) {
			if (data.results.IsOpen)
				return
			else
				delete arbitrageQueue[i]
		})
	}
}

//buyETHXRP(rate)
// function buyETHXRP(rate, quantity = 53){
//   totalXRPQuantity -= quantity
//   bittrex.buylimit({ market : 'ETH-XRP',  
//                     quantity: quantity, 
//                     rate: rate
//                   }, 
//   function( data, err ) {
//     console.log( data );
//     console.log( err );
//   });

// }


/**
 *  sendCustomRequest example
 */
// bittrex.sendCustomRequest( 'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-ltc', function( data ) {
//   console.log( data );
// }, true);

// bittrex.getbalance({ currency : 'ETH' }, function( data, err ) {
//   console.log( data );
//   console.log( err );
// });

// bittrex.getbalances( function( data, err ) {
//   console.log( data );
//   console.log( err );
// });

// bittrex.buylimit({ market : 'BTC-ETH',  
//                    quantity: 0.14802553, 
//                    rate: 0.07300400}, function( data, err ) {
//   console.log( data );
//   console.log( err );
// });


// bittrex.getopenorders({}, function( data, err ) {
//   console.log( data );
//   console.log( err );
// });

// bittrex.cancel({uuid:'4a9f577e-d8b0-44e4-836e-8406ec1e5bf4'}, function( data, err ) {
//   console.log( data );
//   console.log( err );
// });

// /**
//  *  getmarkethistory example
//  */
// bittrex.getmarkethistory( { market : 'BTC-LTC' }, function( data ) {
//   console.log( data.result );
// });

// /**
//  *  getorderbook example
//  */
// bittrex.getorderbook( { market : 'BTC-PIVX', depth : 10, type : 'both' }, function( data ) {

//     data.result.buy.forEach(function(dataset) { console.log(dataset); });
//     data.result.sell.forEach(function(dataset) { console.log(dataset); });
// });

function writeToLog(filename, data) {
	fs.appendFile('./logs/' + moment().format('DD-MM-YYYY') + filename, data, function (err) {
		if (err) console.log(err);
		// console.log('Saved!');
	});
}