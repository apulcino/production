"use strict"

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
class traceMgr {
    //Multicast Client receiving sent messages
    constructor(_name) {
        this.name = _name;
        this.date = new Date();
    }
    error() {
        this.date = new Date();
        arguments[0] = colors.FgRed + this.date.getTime() + ' : ERROR : ' + this.name + ' : ' + arguments[0] + colors.Reset;
        console.error.apply(null, arguments);
    }
    warn() {
        this.date = new Date();
        arguments[0] = colors.FgYellow + this.date.getTime() + ' : WARN  : ' + this.name + ' : ' + arguments[0] + colors.Reset;
        console.warn.apply(null, arguments);
    }
    info() {
        this.date = new Date();
        arguments[0] = colors.FgGreen + this.date.getTime() + ' : INFO  : ' + this.name + ' : ' + arguments[0] + colors.Reset;
        console.info.apply(null, arguments);
    }
    debug() {
        this.date = new Date();
        arguments[0] = colors.FgWhite + this.date.getTime() + ' : DEBUG : ' + this.name + ' : ' + arguments[0] + colors.Reset;
        console.log.apply(null, arguments);
    }
    log() {
        this.date = new Date();
        arguments[0] = '' + this.date.getTime() + ' : DEBUG : ' + this.name + ' : ' + arguments[0] + colors.Reset;
        console.log.apply(null, arguments);
    }
};
module.exports = traceMgr;