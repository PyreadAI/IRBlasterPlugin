const request = require('request');
const url = require('url');

const Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("irblaster-plugin", "MyIRBlaster", myIRBlaster);
};

function myIRBlaster(log, config) {
    this.log = log;
    this.upUrl = url.parse(config['upUrl']);
    this.downUrl = url.parse(config['downUrl']);
    // this.startVolume = config['StartVolume'];
}

myIRBlaster.prototype = {
    getServices: () => {
        //TODO
        let infoService = new Service.AccessoryInformation().setCharacteristic(Characteristic.Manufacturer, "IRBlaster manufacturer")
            .setCharacteristic(Characteristic.Model, "IRBlaster model")
            .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
        let upService = new Service.Switch("VolumeUp").getCharacteristic(Characteristic.On)
            .on('set', this.upService.bind(this));
        let downService = new Service.Switch("VolumeDown").getCharacteristic(Characteristic.On)
            .on('set', this.downService.bind(this));
        // let upService = new Service.Fan("IRBlaster").getCharacteristic(new Characteristic.RotationSpeed())
        //     .on('set', this.setUP.bind(this));
        // let downService = new Service.Fan("IRBlaster").getCharacteristic(new Characteristic.RotationSpeed())
        //     .on('set', this.setDOWN.bind(this));

        this._infoService = infoService;
        this._upService = upService;
        this._downService = downService;
        return [_infoService, _upService, _downService];
    }
}

myIRBlaster.prototype = {

    upService: function (on, next) {
        const me = this;
        request({
            url: me.upUrl,
            body: { 'targetState': on },
            method: 'POST',
            headers: { 'Content-type': 'application/json' }
        },
            function (error, response) {
                if (error) {
                    me.log('STATUS: ' + response.statusCode);
                    me.log(error.message);
                    return next(error);
                }
                return next();
            });
    },
    downService: function (on, next) {
        const me = this;
        request({
            url: me.downUrl,
            body: { 'targetState': on },
            method: 'POST',
            headers: { 'Content-type': 'application/json' }
        },
            function (error, response) {
                if (error) {
                    me.log('STATUS: ' + response.statusCode);
                    me.log(error.message);
                    return next(error);
                }
                return next();
            });
    }
}

