"use strict"
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
const dgram = require('dgram');


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
class multicastReceiver {
    /**
     * ------------------------------------------------------------------------------
     * Multicast Client receiving sent messages
     * @param {string} _HOST
     * @param {string} _MCAST_PORT
     * @param {string} _MCAST_ADDR
     * @param {string} localPublicIpAddress
     * @param {string} callback
     * @public
     * ------------------------------------------------------------------------------
     */
    constructor(_HOST, _MCAST_PORT, _MCAST_ADDR, localPublicIpAddress, callback) {
        localPublicIpAddress = localPublicIpAddress || ['127.0.0.1'];
        this.callback = callback || function () { };
        this.MCAST_PORT = _MCAST_PORT;
        this.MCAST_ADDR = _MCAST_ADDR; //same mcast address as Server
        this.HOST = _HOST; //this is your own IP

        this.client = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        this.client.on('listening', () => {
            var address = this.client.address();
            console.log('UDP Client listening on ' + address.address + ":" + address.port);
            this.client.setBroadcast(true)
            this.client.setMulticastLoopback(true);
            this.client.setMulticastTTL(128);
            this.client.addMembership(this.MCAST_ADDR);
        });

        this.client.on('message', (message, remote) => {
            this.callback(this.MCAST_ADDR, this.MCAST_PORT, JSON.parse('' + message));
        });

        //this.client.bind(this.MCAST_PORT, this.HOST);
        this.client.bind(this.MCAST_PORT, '0.0.0.0');
    }
};
module.exports = multicastReceiver;