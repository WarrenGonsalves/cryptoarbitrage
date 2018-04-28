var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");
var currency = 'ETH';
var coin = 'ZEC'

const bittrex = require('./node.bittrex.api');
const APIKEY = process.env.BITTREXKEY;
const APISECRET = process.env.BITTREXSECRET;
let totalXRPQuantity = 53;
bittrex.options({ 
  'apikey' : APIKEY, 
  'apisecret' : APISECRET, 
  'stream' : false, 
  'verbose' : false, 
  'cleartext' : false 
});

new CronJob('*/5 * * * * *', function() {
  console.log('You will see this message 5 second');
  var a = getBittrixOrderBook();
  var b = getHitbtcOrderBook();
	var c = getBittrixLastTrade();
	var d = getHitbtcLastTrade();
  compareRates(a, b, c, d);
}, true, true);


function compareRates(a, b, c, d) {
	
	Promise.all([a, b, c, d])
	.then(function(data) {  

  	console.log("Bittrex OrderBook ", data[0].result.sell[0])
    // console.log(data[0].result.sell[1])
    // console.log(data[0].result.sell[2])

		console.log("Hitbtc OrderBook ", data[1].bid[0])
    // console.log(data[1].bid[1])
    // console.log(data[1].bid[2])

		console.log("---- Last Trade ----")
		console.log("bittrex ",data[2].result[0].Price, data[2].result[0].OrderType)
    // console.log(data[2])
		console.log("hitbtc ",data[3][0].price, data[3][0].side)

		// console.log( parseFloat(data[1].bid[0].price), data[0].result.sell[0].Rate );
		console.log("---- Arbit ----")
    let arbit = [( parseFloat(data[1].bid[0].price) / data[0].result.sell[0].Rate ) * 100 - 100];
    console.log(arbit)
	})
	.catch(function (err) {
		console.log(err)
	});
}

function getBittrixOrderBook() {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getorderbook',
	  qs: { type: 'both', market: `${currency}-${coin}` },
	  json: true
	};

	return rp(options)

}


function getHitbtcOrderBook() {
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
	var options = { method: 'GET',
	  url: `https://api.hitbtc.com/api/2/public/trades/${coin}${currency}?sort=DESC`,
	  json: true
	};

	return rp(options)

}




//buyETHXRP(rate)
function buyETHXRP(rate, quantity = 53){
  totalXRPQuantity -= quantity
  bittrex.buylimit({ market : 'ETH-XRP',  
                    quantity: quantity, 
                    rate: rate
                  }, 
  function( data, err ) {
    console.log( data );
    console.log( err );
  });

}


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


bittrex.getopenorders({}, function( data, err ) {
  console.log( data );
  console.log( err );
});

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
