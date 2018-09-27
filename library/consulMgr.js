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
    consul: require('consul')({
        "secure": false,
        "host": "127.0.0.1"
    }),
    /**
     * Registration template
    */
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

        this.consul.agent.service.register(this.reg, function (err) {
            if (err) {
                throw err;
            }
        });
    },
    /**
     * get list of services
     * @param {requestCallback} _callbackErr - The callback that handles the error.
     * @param {requestCallback} _callbackOK - The callback that handles the success.
     */
    GetAllHealthyServices: function (_callbackErr, _callbackOK) {
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        this.consul.agent.service.list(function (err, result) {
            if (err) {
                callbackErr(err);
            } else {
                let services = [];
                for (var name in result) {
                    services.push({
                        "address": result[name].Address,
                        "port": result[name].Port,
                        "name": result[name].Service,
                        "url": "http://" + result[name].Address + ":" + result[name].Port,
                        "id": result[name].ID
                    });
                }
                // [
                //     {"address":"158.50.163.7","port":8080,"name":"APIGateway","url":"http://158.50.163.7:8080","id":"APIGateway_8080"},
                //     {"address":"158.50.163.7","port":51102,"name":"authent-v1","url":"http://158.50.163.7:51102","id":"authent-v1_51102"}
                // ]
                callbackOK(services);
            }
        });
    },
    HealthyServices: [],
    /**
     * convert public url to microservice local url
     * @param {string} __reqUrl - The public url to convert to microservice private url.
     * @param {requestCallback} _callbackErr - The callback that handles the error.
     * @param {requestCallback} _callbackOK - The callback that handles the success.
    */
    Resolve: function (_reqUrl, _callbackErr, _callbackOK) {
        this.HealthyServices = [];
        let reqUrl = _reqUrl;
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        if (0 === this.HealthyServices.length) {
            this.GetAllHealthyServices(
                (err) => {
                    callbackErr(err);
                },
                (services) => {
                    this.HealthyServices = services;
                    callbackOK(ResolveUrl(reqUrl, this.HealthyServices));
                });
        } else {
            callbackOK(ResolveUrl(reqUrl, this.HealthyServices));
        }
    }
}

/**
 * convert public url to microservice local url
 * @param {string} __reqUrl - The public url to convert to microservice private url Ex: "/authent/v1/user/login"
 * Retourne : http://158.50.163.7:51102/api/v1/user/login
*/
function ResolveUrl(reqUrl, HealthyServices) {
    // [
    //     {"address":"158.50.163.7","port":8080,"name":"APIGateway","url":"http://158.50.163.7:8080","id":"APIGateway_8080"},
    //     {"address":"158.50.163.7","port":51102,"name":"authent-v1","url":"http://158.50.163.7:51102","id":"authent-v1_51102"}
    // ]
    let token = reqUrl.split("/");
    let reqSrvName = token[1] + "-" + token[2];
    let selService = HealthyServices.find(service => {
        if (service.name === reqSrvName) {
            service.realUrl = reqUrl.replace(token[1], "api");
            console.log('ResolveUrl : ' + reqUrl + " => " + service.realUrl);
            return true;
        }
    });
    return selService;
}

exports.consulMgr = consulMgr;