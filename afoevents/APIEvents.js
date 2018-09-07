"use strict"
const traceMgr = new (require('../library/tracemgr'))('APIEvents');
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
const apiConnect = 'https://connect.afpforum.com:443/v0.9';

//------------------------------------------------------------------------------
// http://localhost:3001/api/events?lang=fr
//------------------------------------------------------------------------------
router.get('/', (req, res) => {
    var TRANSID = req.get('XAFP-TRANSID');
    traceMgr.log(TRANSID + ' : Return events list')
    getApiEvents().then(resp => {
        res.send(filterEventsByStatus(resp, req.query.lang));
    }).catch(err => {
        console.log('Error 2 :', err);
    });
})
//------------------------------------------------------------------------------
// http://localhost:3001/api/events/events-by-sequence/CUY01?lang=fr
// http://localhost:3001/api/events/events-by-sequence/CUY01,CKJ50?lang=fr
//------------------------------------------------------------------------------
router.get('/events-by-sequence/:eventId', (req, res) => {
    let eventIdList = req.params.eventId;
    if (-1 !== eventIdList.indexOf(',')) {
        eventIdList = eventIdList.split(",");
    } else {
        eventIdList = [];
        eventIdList.push(req.params.eventId);
    }

    // Preparer la table des requête
    var allRequestArray = [];
    eventIdList.forEach((eventId, index) => {
        allRequestArray.push(getApiEventBySequenceId(eventId));
    });

    // Traiter les requetes et attendre la fin
    var allPromise = Promise.all(allRequestArray);

    // Traiter les résultats des requetes
    allPromise.then((respArray => {
        let Result = [];
        respArray.forEach((resp, index) => {
            let res = filterEventsByStatus(resp, req.query.lang);
            Result = Result.concat(res);
        });
        res.end(JSON.stringify(Result));
    })).catch(err => {
        console.log('Error 0 : ', err);
    });
})
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function filterEventsByStatus(_arrEvents, lang) {
    _arrEvents = _arrEvents || [];

    let arrEvents = [];
    if (false === Array.isArray(_arrEvents)) {
        arrEvents = [];
        arrEvents.push(_arrEvents);
        _arrEvents = arrEvents;
    }
    let res = [];
    _arrEvents.forEach((evt, index) => {
        if (evt.status === "USABLE" && evt.privacy === "PUBLIC") {
            let v = {
                sequenceId: evt.sequenceId,
                title: GetEventTitle(evt, lang),
                important: isEventImportant(evt)
            }
            res.push(v);
        }
    });
    return res;
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
function isEventImportant(myEvent) {
    try {
        if (myEvent.topNews.GENERAL == 30)
            return true;
        if (myEvent.topNews.GENERAL >= 20)
            return true;
    } catch (err) {
    }
    return false;
}
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
function GetEventTitle(myEvent, lang) {
    lang = lang || '';
    lang = (lang.Length > 2) ? lang.Substring(0, 2) : lang;
    let res = myEvent.title.en;
    switch (lang.toLowerCase()) {
        case "ar":
            res = myEvent.title.ar;
            break;
        case "de":
            res = myEvent.title.de;
            break;
        case "pt":
            res = myEvent.title.pt;
            break;
        case "fr":
            res = myEvent.title.fr;
            break;
        case "es":
            res = myEvent.title.es;
            break;
        case "en":
        default:
            res = myEvent.title.en;
            break;
    }
    res = res || '';
    if (!res)
        res = myEvent.title.en;
    if (!res)
        res = myEvent.title.de;
    if (!res)
        res = myEvent.title.pt;
    if (!res)
        res = myEvent.title.fr;
    if (!res)
        res = myEvent.title.es;
    if (!res)
        res = myEvent.title.ar;
    if (!res)
        res = "";
    return res;
}
//------------------------------------------------------------------------------
// http://iris-360.afp.com/api/events?max=100&relativeDate=today&relativeDuration=day&start=0&timeEnd=0&timeStart=0
//------------------------------------------------------------------------------
function getApiEvents() {
    const iris360 = 'http://iris-360.afp.com/api/events?max=100&relativeDate=today&relativeDuration=day&start=0&timeEnd=0&timeStart=0';
    console.log('GET : ', iris360);
    return new Promise(function (resolve, reject) {
        fetch(iris360, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            resolve(json);
        }).catch(err => {
            console.log('getApiEvents : Error : ', err);
            resolve(null);
        });
    });
}
//------------------------------------------------------------------------------
// http://iris-360.afp.com/api/events-by-sequence/CUY01
//------------------------------------------------------------------------------
function getApiEventBySequenceId(EventId) {
    const iris360 = 'http://iris-360.afp.com/api/events-by-sequence/'
    console.log('GET : ', iris360);
    return new Promise(function (resolve, reject) {
        fetch(iris360 + EventId, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            resolve(json);
        }).catch(err => {
            console.log('getApiEvents : Error : ', err);
            resolve(null);
        });
    });
}

module.exports = router;