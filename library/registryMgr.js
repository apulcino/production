// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
"use strict"
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
const constantes = require('./constantes');

// ------------------------------------------------------------------------------
// Cacher la liste des registry visible sur le réseau
// Chaque composant possède son instance et alimente la liste à partir des messages
// diffusés sur le réseau.
// ------------------------------------------------------------------------------
class RegistryMgr {
    //------------------------------------------------------------------------------
    // Se met à l'écoute des regiostry (udp multicast)
    //------------------------------------------------------------------------------
    constructor(traceMgr) {
        this.traceMgr = traceMgr;
        this.AFORegisteryUrl = [];
    }
    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    checkRegistryStatus() {
        let AFORegisteryUrlList = this.getList();
        AFORegisteryUrlList.forEach((reg, index) => {
            constantes.getServiceList(this.traceMgr, reg).then(data => {
                // ne rien faire...tout est OK
            }).catch((AFORegisteryUrlWithError) => {
                // Indiquer que cet annuaire n'est pas fiable...
                this.error(AFORegisteryUrlWithError);
            });
        });
    }
    //------------------------------------------------------------------------------
    // Retourne une copie la liste des Registry connues
    //------------------------------------------------------------------------------
    getList() {
        var res = JSON.stringify(this.AFORegisteryUrl);
        return JSON.parse(res);
    }
    //------------------------------------------------------------------------------
    // Ajoute une Regisqtry à la liste
    //------------------------------------------------------------------------------
    add(host, port) {
        var regUrl = 'http://' + host + ':' + port;
        let idx = this.findIndexRegistryByUrl(regUrl);
        if (-1 === idx) {
            // Url + Compteur
            this.AFORegisteryUrl.push({
                regUrl: regUrl,
                cptrTO: 10,
                contact: true
            });
        } else {
            let reg = this.AFORegisteryUrl[idx];
            reg.cptrTO = 10;
            reg.contact = true;
        }
        // Supprimer toutes les Registry qui ne répondent plus
        this.AFORegisteryUrl = this.AFORegisteryUrl.filter((reg) => {
            return (reg.contact === true);
        });
    }
    //------------------------------------------------------------------------------
    // Rechercher l'élément à partir de son Url
    //------------------------------------------------------------------------------
    findIndexRegistryByUrl(regUrl) {
        let idx = this.AFORegisteryUrl.findIndex((item) => {
            return (item.regUrl === regUrl);
        });
        return idx;
    }
    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    delete(regUrl) {
        let idx = this.findIndexRegistryByUrl(regUrl);
        if (-1 !== idx) {
            this.AFORegisteryUrl.splice(idx, 1);
        }
        if (0 === this.AFORegisteryUrl.length) {
            this.traceMgr.error('All registry contact are lost !');
        } else {
            this.traceMgr.error('Registry contact is lost with : ', regUrl);
        }

    }
    //------------------------------------------------------------------------------
    // Supprime une registry de la liste
    // failedRegistryUrl = {regUrl: "http://158.50.163.7:58679", cptrTO: 10, contact: true}
    //------------------------------------------------------------------------------
    error(failedRegistry) {
        let idx = this.findIndexRegistryByUrl(failedRegistry.regUrl);
        if (-1 !== idx) {
            this.AFORegisteryUrl[idx].contact = false;
            this.delete(failedRegistry.regUrl || '');
        }
    }
};
module.exports = RegistryMgr;