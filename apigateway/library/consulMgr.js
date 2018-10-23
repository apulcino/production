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
const fetch = require('node-fetch');
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
     * unRegister a service
     */
    unRegister: function (msID, _callbackErr, _callbackOK) {
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        this.consul.agent.service.deregister(this.reg, (err) => {
            if (err) {
                callbackErr(err);
            } else {
                callbackOK(msID);
            }
        });
    },
    /**
     * Register a service
     */
    Register: function (opts, _callbackErr, _callbackOK) {
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        opts = opts || {};
        this.reg.ID = opts.Name + "_" + opts.Port;
        this.reg.Name = opts.Name;
        this.reg.Tags = opts.Tags;
        this.reg.Address = opts.Address;
        this.reg.Port = opts.Port;
        this.reg.Check.HTTP = "http://" + opts.Address + ":" + opts.Port + "/health/status";

        this.consul.agent.service.register(this.reg, (err) => {
            if (err) {
                callbackErr(err);
            } else {
                callbackOK(this.reg.ID);
            }
        });
    },
    /**
     * get list of services (healthy and unhealthy)
     * @param {requestCallback} _callbackErr - The callback that handles the error.
     * @param {requestCallback} _callbackOK - The callback that handles the success.
     */
    GetAllServices: function (_callbackErr, _callbackOK) {
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
    ResetCptr: 0,
    /**
     * convert public url to microservice local url
     * @param {string} __host - The host ex: 'msafo.srv.afoevents.v1:8080'.
     * @param {string} __reqUrl - The public url to convert to microservice private url.
     * @param {requestCallback} _callbackErr - The callback that handles the error.
     * @param {requestCallback} _callbackOK - The callback that handles the success.
    */
    Resolve: function (traceMgr, _host, _reqUrl, _callbackErr, _callbackOK) {
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        let reqUrl = _reqUrl;
        let token = _host.split(':');
        token = token[0].split('.')
        let srvName = token[2] + "-" + token[3];

        this.ResetCptr++;
        if (0 === this.ResetCptr % 1000) {
            this.setHealthyService(null);
        }

        var availableServices = this.findAvailableServices(srvName);
        if (0 === availableServices.length) {
            this.GetAllHealthyServices(srvName,
                (err) => {
                    callbackErr(err);
                },
                (services) => {
                    availableServices = this.setHealthyService(services);
                    callbackOK(ResolveUrl(reqUrl, srvName, availableServices));
                });
        } else {
            callbackOK(ResolveUrl(reqUrl, srvName, availableServices));
        }
    },
    /**
     *
    */
    findAvailableServices: function (srvName) {
        if (0 === this.HealthyServices.length) {
            return [];
        } else {
            return this.HealthyServices[srvName];
        }
    },
    /**
     *
     */
    setHealthyService: function (newRes) {
        if (!newRes) {
            this.HealthyServices = [];
        } else {
            this.HealthyServices[newRes[0].Service] = newRes;
        }
        return newRes || [];
    },
    /**
    * get list of healthy services : http://localhost:8500/v1/health/service/authent-v1?passing=true
    * @param {string} srvName - Searched service name.
    * @param {requestCallback} _callbackErr - The callback that handles the error.
    * @param {requestCallback} _callbackOK - The callback that handles the success.
    */
    GetAllHealthyServices: function (srvName, _callbackErr, _callbackOK) {
        let callbackErr = _callbackErr || function () { };
        let callbackOK = _callbackOK || function () { };
        getConsulHealthyService(srvName).then(result => {
            let services = [];
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                item.Service.url = "http://" + item.Service.Address + ":" + item.Service.Port;
                services.push(item.Service);
            }
            callbackOK(services);
        }).catch(err => {
            callbackErr(err);
        });
    }
}

/**
 * convert public url to microservice local url
 * @param {string} reqUrl - url original ("/events/events-by-sequence/CUY01?lang=fr")
 * @param {string} srvName - service name (afoevents-v1)
 * Retourne :
 * http://158.50.163.7:3100/events/events-by-sequence/CUY01?lang=fr
 * à partir de l'appel de :
 * http://msafo.srv.afoevents.v1:8080/events/events-by-sequence/CUY01?lang=fr
*/
function ResolveUrl(reqUrl, srvName, HealthyServices) {
    // [
    // "Service":{
    //     "ID":"authent-v1_51609",
    //     "Service":"authent-v1",
    //     "Tags":["authentication", "v1"],
    //     "Address":"158.50.163.7",
    //     "Meta":null,
    //     "Port":51609,
    //     "Weights":{
    //     "Passing":1,
    //     "Warning":1
    //     },
    //     "EnableTagOverride":false,
    //     "ProxyDestination":"",
    //     "Connect":{
    //     "Native":false,
    //     "Proxy":null
    //     },
    //     "CreateIndex":65703,
    //     "ModifyIndex":65829,
    //     "url":"http://158.50.163.7:51609"
    //     },
    //     {...}
    // ]
    let selService = HealthyServices.filter(service => {
        if (service.Service === srvName) {
            service.realUrl = service.url + reqUrl;
            return true;
        }
    });
    return JSON.parse(JSON.stringify(selService));
}

/**
 *
 */
function getConsulHealthyService(srvName) {
    const consulUrl = 'http://localhost:8500/v1/health/service/' + srvName + '?passing=true';
    return new Promise(function (resolve, reject) {
        fetch(consulUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            resolve(json);
        }).catch(err => {
            console.log('getConsulHealthyService : Error : ', err);
            resolve(null);
        });
    });
}

exports.consulMgr = consulMgr;