var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");
var currency = 'ETH';
var coins = ['ZEC', 'XRP']
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

function compareRates(promiseList, coin) {
	
	Promise.all(promiseList)
	.then(function(data) {  
		let log = '\n' + moment().format() + ',';
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
		
		writeToLog(coin + 'ETHBittrexHitbtc.txt', log);
		// console.log( parseFloat(data[1].bid[0].price), data[0].result.sell[0].Rate );
		// console.log("---- Arbit ----")
    let arbit = [( parseFloat(data[1].bid[0].price) / data[0].result.sell[0].Rate ) * 100 - 100];
    // console.log(arbit)
	})
	.catch(function (err) {
		console.log(err)
	});
}

function getBittrixOrderBook(coin) {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getorderbook',
	  qs: { type: 'both', market: `${currency}-${coin}` },
	  json: true
	};

	return rp(options)

}


function getHitbtcOrderBook(coin) {
	var options = { method: 'GET',
	  url: `https://api.hitbtc.com/api/2/public/orderbook/${coin}${currency}`,
	  json: true
	};

	return rp(options)

}

function getBittrixLastTrade() {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getmarkethistory',
	  qs: { market: `${currency}-${coin}` },
	  json: true
	};

	return rp(options)

}


function getHitbtcLastTrade() {
	console.log('hitbtc last')
	var options = { method: 'GET',
	  url: `https://api.hitbtc.com/api/2/public/trades/${coin}${currency}?sort=DESC`,
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
	fs.appendFile(filename, data, function (err) {
	  if (err) console.log(err);
	  // console.log('Saved!');
	});
}