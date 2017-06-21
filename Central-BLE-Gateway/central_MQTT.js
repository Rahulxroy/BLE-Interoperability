var noble=require('/opt/node-v6.9.4-linux-armv7l/lib/node_modules/noble'); //path to the noble package
var mqtt=require('mqtt');
var JSON=require('JSON');
var client=mqtt.connect('mqtt://192.168.23.8:1883');
var ci;

noble.on('stateChange', function(state){
	if (state === 'poweredOn') {
	console.log('power is on -> scanning...');
	noble.startScanning();
	}
	else{
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
					client.publish('topic/dht11','{Value:'+temp.toString()+'}');
					//console.log('room temperature2 is: ' + temp);
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
