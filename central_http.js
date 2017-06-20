var noble=require('/opt/node-v6.9.4-linux-armv7l/lib/node_modules/noble'); //path of noble package
var http=require('http');
var JSON=require('JSON');
var ci;
var querystring = require('querystring');

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		console.log('power is on -> scanning...');
		noble.startScanning();
	}
	else {
		noble.stopScanning();
		console.log('scanning stopped');
	}
});

noble.on('discover', function (peripheral) {

	peripheral.connect(function(error) {
		console.log('connected to peripheral: ' + peripheral.uuid);
		peripheral.discoverServices(['215bfaa1c6814993b0960a0c6b8169da'], function(error, services) {
		var deviceInformationService = services[0];

		deviceInformationService.discoverCharacteristics(['d180cf6d85e849079c109b4051daf46b'], function(error, characteristics) {
		var peripheralCharacteristic = characteristics[0];
		console.log('peripheral characteristics');

		ci = setInterval(function(){
			peripheralCharacteristic.read(function(error, data) {
			var temp = parseFloat(data).toFixed(5);
			var payload={};
		payload.Value=temp;
		var postdata= querystring.stringify(payload);
		var options={
				hostname: '192.168.23.8:8080',
				path: '/http/update/dht11',
				method: 'POST',
				headers:
				{
					'content-Type':'application/x-www-form-urlencoded',
					'content-Length':Buffer.byteLength(postdata)
				}
				};

var req=http.request(options,function(res){
});
				req.write(postdata);


				req.end();

		console.log('room temperature2 is: ' + temp);
		});
		},4000);
		});
	});
});


peripheral.disconnect(function(error) {
		console.log('disconnected from peripheral: ' + peripheral.uuid);

		clearInterval(ci);
		});
});
