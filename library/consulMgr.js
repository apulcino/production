// var reg = {
//     "ID": ID,
//     "Name": ID,
//     "Tags": [
//         "authentication",
//         "v1"
//     ],
//     "Address": host,
//     "Port": port,
//     "Meta": {
//         "authent_version": "1.0"
//     },
//     "EnableTagOverride": false,
//     "Check": {
//         "DeregisterCriticalServiceAfter": "1m",
//         "HTTP": "http://" + host + ":" + port + "/health/status",
//         "Interval": "10s",
//         "TTL": "15s"
//     }
// }
'use strict';

var consulMgr = {
    reg: {
        "ID": "",
        "Name": "",
        "Tags": [],
        "Address": "",
        "Port": 0,
        "Meta": {},
        "EnableTagOverride": false,
        "Check": {
            "DeregisterCriticalServiceAfter": "1m",
            "HTTP": "",
            "Interval": "10s",
            "TTL": "15s"
        }
    },
    /**
     * Register a service
     */
    Register: function (opts) {
        opts = opts || {};
        this.reg.ID = opts.Name + "_" + opts.Port;
        this.reg.Name = opts.Name;
        this.reg.Tags = opts.Tags;
        this.reg.Address = opts.Address;
        this.reg.Port = opts.Port;
        this.reg.Check.HTTP = "http://" + opts.Address + ":" + opts.Port + "/health/status";

        const consul = require('consul')({
            "secure": false,
            "host": "127.0.0.1"
        });

        consul.agent.service.register(this.reg, function (err) {
            if (err)
                throw err;
        });
    }
}

exports.consulMgr = consulMgr;