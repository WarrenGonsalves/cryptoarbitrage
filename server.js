var CronJob = require('cron').CronJob;
var request = require('request');
var rp = require('request-promise');
var Promise = require("bluebird");
var currency = 'ETH';
var coins = ['ZEC', 'XRP']
const fs = require('fs');
const moment = require('moment');

const { Bittrex: BX } = require('./bittrex')
const { Hitbtc: HC } = require('./hitbtc')
const Arbitrage = require('./arbitrage')

const bittrex = require('./node.bittrex.api');

const BXAPIKEY = process.env.BITTREXKEY;
const BXAPISECRET = process.env.BITTREXSECRET;
const HBTCAPIKEY = process.env.HITBTCKEY;
const HBTCAPISECRET = process.env.HITBTCSECRET;
bittrex.options({
	'apikey': BXAPIKEY,
	'apisecret': BXAPISECRET,
	'stream': false,
	'verbose': false,
	'cleartext': false
});
let arbitrageQueue = [];
let totalXRPQuantity = 53;
// bittrex.options({ 
//   'apikey' : APIKEY, 
//   'apisecret' : APISECRET, 
//   'stream' : false, 
//   'verbose' : false, 
//   'cleartext' : false 
// });

(function myLoop(i) {
	setTimeout(function () {
		let count = i - 1;
		let cronPattern = (i - 1);
		while (count < 60) {
			cronPattern += ',' + count;
			count += 5;
		}
		console.log(cronPattern);
		//  your code here                
		if (--i) myLoop(i);
		//  decrement i and call myLoop again if i > 0
		new CronJob({
			cronTime: cronPattern + ' * * * * *',
			onTick: function () {
				var coin = coins[i];
				console.log(coin + 'ETH cron');
				const bx = new BX({
					key: BXAPIKEY,
					secret: BXAPISECRET
				})
				const hc = new HC({
					key: HBTCAPIKEY,
					secret: HBTCAPISECRET
				})
				const i = 0
				if(typeof arbitrageQueue[i] === 'undefined'){
					console.log("arbitrage.arbitrage(bx, hc, 'ETH', 0.00002, 0.00002)")
					const arbitrage = new Arbitrage(hc, bittrex, 'XRP', 0.00002, 0.00002)
					arbitrageQueue.push(arbitrage)
					arbitrage.init(hc, bittrex, 'XRP', 0.00002, 0.00002).then(function (data) {
						//console.log(data)
						return new Promise((resolve, reject) => {
							bittrex.selllimit({
								market: `ETH-XRP`,
								quantity: 0.00041338,
								rate: 0.00125477
							}, function (data, err) {
								console.log("err", err)
								if (err)
									reject(err)
								else
									resolve(data)

							});
						});
					}).then(function (data) {
						console.log(data)
						arbitrage.status = 'init'
					}).then(function (err) {
						console.log("err")
						console.log(err)
					})
				}
				else if(arbitrageQueue[i].status === 'init')
				{
					arbitrageQueue[i].checkOrderData(arbitrageQueue[i].lastOrderId).then(function(data){
						if(data.results.IsOpen)
							return
						else
						{
							return new Promise((resolve, reject) => {
								bittrex.withdraw({
									market: data.results.Exchange,
									quantity: data.results.Quantity
								}, function (data, err) {
									console.log("err", err)
									if (err)
										reject(err)
									else
										resolve(data)
	
								});
							});
						}

					}).then(function (data) {
						console.log(data)
						arbitrageQueue[i].status = 'withdraw'
						arbitrageQueue[i].withdrawId = data.result.uuid
					})
				}
				else if(arbitrageQueue[i].status === 'withdraw')
				{
					arbitrageQueue[i].checkWithdraw(arbitrageQueue[i].withdrawId).then(function(data){
						if(data.results.IsOpen)
							return
						else
						{
							return new Promise((resolve, reject) => {
								hitbtc.sell({
									market: `ETH-XRP`,
									quantity: 0.00041338,
									rate: 0.00125477
								}, function (data, err) {
									console.log("err", err)
									if (err)
										reject(err)
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
				else if(arbitrageQueue[i].status === 'sell')
				{
					arbitrageQueue[i].checkOrderData(arbitrageQueue[i].lastOrderId).then(function(data){
						if(data.results.IsOpen)
							return
						else
							delete arbitrageQueue[i]
					})
				}
				// var a = getBittrixOrderBook(coin);
				// var b = getHitbtcOrderBook(coin);
				// // var c = getBittrixLastTrade();
				// // var d = getHitbtcLastTrade();
				// compareRates([a, b],coin);

			},
			start: true,
			runOnInit: true
		});

	}, 1000)
})(coins.length);

function compareRates(promiseList, coin) {

	Promise.all(promiseList)
		.then(function (data) {
			let log = '\n' + moment().format() + ',';
			log += data[0].result.buy[0].Quantity + ',' + data[0].result.buy[0].Rate + ',' + data[0].result.sell[0].Quantity + ',' + data[0].result.sell[0].Rate;

			log += ',' + data[1].bid[0].size + ',' + data[1].bid[0].price + ',' + data[1].ask[0].size + ',' + data[1].ask[0].price;
			writeToLog(coin + 'ETHBittrexHitbtc.txt', log);
			let arbit = [(parseFloat(data[1].bid[0].price) / data[0].result.sell[0].Rate) * 100 - 100];
		})
		.catch(function (err) {
			console.log(err)
		});
}

function getBittrixOrderBook(coin) {
	var options = {
		method: 'GET',
		url: 'https://bittrex.com/api/v1.1/public/getorderbook',
		qs: { type: 'both', market: `${currency}-${coin}` },
		json: true
	};

	return rp(options)

}


function getHitbtcOrderBook(coin) {
	var options = {
		method: 'GET',
		url: `https://api.hitbtc.com/api/2/public/orderbook/${coin}${currency}`,
		json: true
	};

	return rp(options)

}

function getBittrixLastTrade() {
	var options = {
		method: 'GET',
		url: 'https://bittrex.com/api/v1.1/public/getmarkethistory',
		qs: { market: `${currency}-${coin}` },
		json: true
	};

	return rp(options)

}


function getHitbtcLastTrade() {
	console.log('hitbtc last')
	var options = {
		method: 'GET',
		url: `https://api.hitbtc.com/api/2/public/trades/${coin}${currency}?sort=DESC`,
		json: true
	};

	return rp(options)

}

//buyETHXRP(rate)
function buyETHXRP(rate, quantity = 53) {
	totalXRPQuantity -= quantity
	bittrex.buylimit({
		market: `${currency}-${coin}`,
		quantity: quantity,
		rate: rate
	},
		function (data, err) {
			console.log(data);
			console.log(err);
		});

}

function withdrawXRP(quantity, address, paymentid) {
	bittrex.withdraw({
		currency: `${currency}-${coin}`,
		quantity: quantity,
		address: address,
		paymentid: paymentid
	}, function (data, err) {
		console.log(data);
		console.log(err);
	});
}

function writeToLog(filename, data) {
	fs.appendFile(filename, data, function (err) {
		if (err) console.log(err);
		// console.log('Saved!');
	});
}