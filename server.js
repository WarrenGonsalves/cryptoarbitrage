var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");

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

  	console.log("bittrex")
  	console.log(data[0].result.sell[0])
    // console.log(data[0].result.sell[1])
    // console.log(data[0].result.sell[2])

		console.log("hitbtc")
    console.log(data[1].bid[0])
    // console.log(data[1].bid[1])
    // console.log(data[1].bid[2])

		console.log("---- Last Trade ----")
		console.log("bittrex")
    // console.log(data[2])
    console.log(data[2].result[0].Price, data[2].result[0].OrderType)

		console.log("hitbtc")
    console.log(data[3][0].price, data[3][0].side)

    // console.log( parseFloat(data[1].bid[0].price), data[0].result.sell[0].Rate );
		console.log("---- Arbit ----")
    let arbit = [( parseFloat(data[3][0].price) / data[2].result[0].Price ) * 100 - 100];
    console.log(arbit)
	})
	.catch(function (err) {
		console.log(err)
	});
}

function getBittrixOrderBook() {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getorderbook',
	  qs: { type: 'both', market: 'ETH-XRP' },
	  json: true
	};

	return rp(options)

}


function getHitbtcOrderBook() {
	var options = { method: 'GET',
	  url: 'https://api.hitbtc.com/api/2/public/orderbook/XRPETH',
	  json: true
	};

	return rp(options)

}

function getBittrixLastTrade() {
	var options = { method: 'GET',
	  url: 'https://bittrex.com/api/v1.1/public/getmarkethistory',
	  qs: { market: 'ETH-XRP' },
	  json: true
	};

	return rp(options)

}


function getHitbtcLastTrade() {
	var options = { method: 'GET',
	  url: 'https://api.hitbtc.com/api/2/public/trades/XRPETH?sort=DESC',
	  json: true
	};

	return rp(options)

}