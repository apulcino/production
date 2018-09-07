//------------------------------------------------------------------------------
// Diffuseur d'annonce multicast
//------------------------------------------------------------------------------
"use strict"
const dgram = require('dgram');

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
class multicastSender {
    /**
     * ------------------------------------------------------------------------------
     * Multicast Server diffuseur de messages
     * @param {string} _MCAST_PORT
     * @param {string} _MCAST_ADDR
     * @param {string} localPublicIpAddress
     * @param {string} callback
     * @public
     * ------------------------------------------------------------------------------
    */
    constructor(_MCAST_PORT, _MCAST_ADDR, localPublicIpAddress) {
        localPublicIpAddress = localPublicIpAddress || ['127.0.0.1'];
        this.frequency = 10000;
        this.intervalID = null;
        this.MCAST_PORT = _MCAST_PORT;
        this.MCAST_ADDR = _MCAST_ADDR;
        this.server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        this.server.bind(this.PORT, () => {
            this.server.setBroadcast(true);
            this.server.setMulticastLoopback(true);
            this.server.setMulticastTTL(128);
            this.server.addMembership(this.MCAST_ADDR);

            // for (let i = 0; i < localPublicIpAddress.length; i++) {
            //     try {
            //         this.server.addMembership(this.MCAST_ADDR, localPublicIpAddress[i]);
            //     } catch (err) {
            //         console.error('multicastSender : Exception : ', err);
            //     }
            // }
        });
    }
    //------------------------------------------------------------------------------
    // Envoyer un message
    //------------------------------------------------------------------------------
    sendOnce(_message) {
        this.message = _message;
        this.broadcastNew();
    }
    //------------------------------------------------------------------------------
    // Demarrer les diffusions
    //------------------------------------------------------------------------------
    sendAlways(_message, _frequency) {
        this.frequency = _frequency;
        this.message = _message;
        this.intervalID = setInterval(() => { this.broadcastNew() }, this.frequency);
    }
    //------------------------------------------------------------------------------
    // Arreter les diffusions
    //------------------------------------------------------------------------------
    stop() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }
    //------------------------------------------------------------------------------
    // Envoyer les messages
    //------------------------------------------------------------------------------
    broadcastNew() {
        this.server.send(this.message, 0, this.message.length, this.MCAST_PORT, this.MCAST_ADDR);
    }
};
module.exports = multicastSender;