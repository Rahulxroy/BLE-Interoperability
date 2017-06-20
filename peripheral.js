var util = require('util');
var bleno = require('/home/pi/project/node_modules/bleno');
var sensor = require('/usr/local/lib/node_modules/node-dht-sensor');

var BlenoPrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var primaryService;
var character;
var name = 'dht11';
var serviceUuids = ['215bfaa1c6814993b0960a0c6b8169da'];

bleno.on('stateChange', function(state){
        console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn'){
       bleno.startAdvertising(name, serviceUuids);
    }
    else{
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error){
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    bleno.setServices([
        primaryService = new BlenoPrimaryService({
        uuid: '215bfaa1c6814993b0960a0c6b8169da',
        characteristics: [
            character =  new Characteristic({
            uuid: 'd180cf6d85e849079c109b4051daf46b',
            properties: [ 'read'],
            value: null,

            onReadRequest: function(offset,callback){
                var data = new Buffer(50);
                sensor.read(11,4, function(err,temperature,humidity){
                    if(!err){
                        console.log('temp: ' + temperature.toFixed(2) + ' *C,' + 'humidity: ' + humidity.toFixed(2));
                        temp  = temperature.toFixed(2);
                        temp = temp.toString();
                        data.write(temp);
                        callback(Characteristic.RESULT_SUCCESS,data);
                        return data;
                    }
                    else console.error(err);
                });
            }
            })
        ]
        })
    ]);
    bleno.on('disconnect', function(){
    console.log('client disconnected');
    });

});
