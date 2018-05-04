var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");
// var currency = 'ETH';
// var currencyHitbtc = 'USD';
var coins = [{
		coin: 'XRP',
		currBittrex: 'USDT',
		currHitbtc: 'USDT',
	},{
		coin: 'ETH',
		currBittrex: 'USDT',
		currHitbtc: 'USD',
	},{
		coin: 'NEO',
		currBittrex: 'USDT',
		currHitbtc: 'USD',
	},{
		coin: 'LTC',
		currBittrex: 'USDT',
		currHitbtc: 'USD',
	},{
		coin: 'XEM',
		currBittrex: 'ETH',
		currHitbtc: 'ETH',
	}]
const fs = require('fs');
const moment = require('moment');

const bittrex = require('./node.bittrex.api');
const APIKEY = process.env.BITTREXKEY;
const APISECRET = process.env.BITTREXSECRET;
let totalXRPQuantity = 53;
// bittrex.options({ 
//   'apikey' : APIKEY, 
//   'apisecret' : APISECRET, 
//   'stream' : false, 
//   'verbose' : false, 
//   'cleartext' : false 
// });

(function myLoop (i) {          
  setTimeout(function () {  
  	let count = i - 1;
  	let cronPattern = (i - 1);
  	while(count < 60){
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
    console.log(cronPattern);          //  your code here                
    if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
    new CronJob({
			cronTime: cronPattern + ' * * * * *',
			onTick: function() {
			  var coin = coins[i];
			  // console.log(coin + 'ETH cron');
			  var a = getBittrixOrderBook(coin);
			  var b = getHitbtcOrderBook(coin);
				// var c = getBittrixLastTrade();
				// var d = getHitbtcLastTrade();
			  compareRates([a, b],coin);
			},
			start: true,
			runOnInit:true
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
// getCost("XRP", "ETH")
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

function compareRates(promiseList, pair) {
	
	Promise.all(promiseList)
	.then(function(data) {  
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
    let arbitBittHit = [( parseFloat(data[1].bid[0].price) / data[0].result.sell[0].Rate ) * 100 - 100];
    let diffBittHit = parseFloat(data[1].bid[0].price) - data[0].result.sell[0].Rate;
    let arbitHitBitt = [( data[0].result.buy[0].Rate / parseFloat(data[1].ask[0].price) ) * 100 - 100];
    let diffHitBitt = data[0].result.buy[0].Rate - parseFloat(data[1].ask[0].price);
    log += ',' + arbitBittHit + '%,' + diffBittHit  + ',' + arbitHitBitt + '%,' + diffHitBitt;
		writeToLog(pair.coin + 'BittrexHitbtc.txt', log);
    // console.log(arbit)
	})
	.catch(function (err) {
		console.log(err)
	});
}

function getBittrixOrderBook(pair) {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getorderbook',
	  qs: { type: 'both', market: `${pair.currBittrex}-${pair.coin}` },
	  json: true
	};

	return rp(options)

}


function getHitbtcOrderBook(pair) {
	var options = { method: 'GET',
	  url: `https://api.hitbtc.com/api/2/public/orderbook/${pair.coin}${pair.currHitbtc}`,
	  json: true
	};

	return rp(options)

}

function getBittrixLastTrade(pair) {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getmarkethistory',
	  qs: { market: `${pair.currBittrex}-${pair.coin}` },
	  json: true
	};

	return rp(options)

}


function getHitbtcLastTrade(pair) {
	var options = { method: 'GET',
	  url: `https://api.hitbtc.com/api/2/public/trades/${pair.coin}${pair.currHitbtc}?sort=DESC`,
	  json: true
	};

	return rp(options)

}

function getCost(coin, currency) {
	let hitbtcFee = 0.1;
	let bittrexFee = 0.25;

	let quantity = 10;
	let transfer1Fee = 1;
	let transfer2Fee = 0.006;				//ETH

	Promise.all([getTicker(coin,currency)])
	.then(function(data) {  
		// console.log(data[0].result);
		transfer2Fee = transfer2Fee/data[0].result.Last;
		let ex1Fee = quantity * bittrexFee / 100;
		let ex2Fee = quantity * hitbtcFee / 100;
		// console.log(transfer1Fee , transfer2Fee , ex1Fee , ex2Fee)
		let cost = transfer1Fee + transfer2Fee + ex1Fee + ex2Fee;
		console.log(cost, (cost*100)/quantity);

	})
	.catch(function (err) {
		console.log(err)
	});
	
}

function getTicker(coin, currency) {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getticker',
	  qs: { type: 'both', market: `${currency}-${coin}` },
	  json: true
	};

	return rp(options)
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
	fs.appendFile('./logs/' + moment().format('DD-MM-YYYY')+ filename, data, function (err) {
	  if (err) console.log(err);
	  // console.log('Saved!');
	});
}