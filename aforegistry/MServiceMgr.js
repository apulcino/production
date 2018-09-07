//------------------------------------------------------------------------------
// Gestion des composants
//------------------------------------------------------------------------------
"use strict"
const fetch = require('node-fetch');
const constantes = require('../library/constantes');
const multicastSender = require('../library/multicastSender');

//------------------------------------------------------------------------------
// Gestionnaire des composants
//------------------------------------------------------------------------------
class MServiceMgr {
    //------------------------------------------------------------------------------
    // Utilisation d'un timer pour vérifier l'état des composants
    //------------------------------------------------------------------------------
    constructor(traceMgr) {
        this.traceMgr = traceMgr;
        // Diffuseur de notification multicast
        this.mcSender = new multicastSender(constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress());

        this.idxcheckMService = 0;
        this.items = [];
        this.intervalObj = setInterval(() => {
            if (this.items.length > 0) {
                this.idxcheckMService %= this.items.length;
                let Srv = this.items[this.idxcheckMService];
                let url = Srv.url + '/health/status';
                this.checkMService(url).then(res => {
                    Srv.cptr += 1;
                    Srv.status = (res === true);
                    if (Srv.status === false) {
                        let arr = this.items.splice(this.idxcheckMService, 1);
                        this.traceMgr.warn('Remove component ref : ', arr[0]);
                        if (0 === this.items.length) {
                            this.traceMgr.error('No component available');
                        }
                        this.sendRegistryUpdateMsg();
                    } else {
                        this.idxcheckMService += 1;
                    }
                });
            }
        }, 5000);
    }
    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    sendRegistryUpdateMsg() {
        this.mcSender.sendOnce(JSON.stringify({ type: constantes.MSMessageTypeEnum.regUpdate }));
    }
    //------------------------------------------------------------------------------
    // Retourner la liste des composants actifs
    //------------------------------------------------------------------------------
    listAll() {
        let activeCompos = this.items.filter((Srv) => {
            return (Srv.status === true);
        });
        return activeCompos;
    }

    //------------------------------------------------------------------------------
    // Ajoute un nouveau composant à la liste
    //------------------------------------------------------------------------------
    declare(protocol, type, host, port, pathname) {
        let ms = {
            type: type,
            url: protocol + '://' + host + ':' + port,
            host: host,
            port: port,
            pathname: pathname,
            status: 0,
            cptr: 0
        }
        let index = this.indexOf(type, ms.url);
        if (-1 === index) {
            this.traceMgr.info('Declare component : ', ms);
            this.items.push(ms);
            this.sendRegistryUpdateMsg();
            return ms;
        } else {
            this.items[index].cptr += 1;
            return this.items[index];
        }
    }
    //------------------------------------------------------------------------------
    // Rechercher un composant à partir de son type et de son Url
    //------------------------------------------------------------------------------
    indexOf(type, url) {
        let idx = -1;
        this.items.forEach((element, index) => {
            if (element.type === type && element.url === url) {
                idx = index;
                return idx;
            }
        });
        return idx;
    }
    //------------------------------------------------------------------------------
    // Appeler le composant pour connaitre son état
    //------------------------------------------------------------------------------
    checkMService(urlSrv) {
        return new Promise(function (resolve, reject) {
            fetch(urlSrv, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                resolve(true);
            }).catch(err => {
                resolve(false);
            });
        });
    }
}

module.exports = MServiceMgr;