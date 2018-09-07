const MServiceMgr = require('./MServiceMgr');
exports.DataShared = {
    traceMgr: null,
    MServices: null,
    initialize: function (traceMgr) {
        this.traceMgr = traceMgr;
        this.MServices = new MServiceMgr(this.traceMgr)
    }
}