//======================================================================
// Task GULP for AFO v2
//======================================================================
var gulp = require('gulp');
var git = require('gulp-git');
var makeDir = require('make-dir');

//======================================================================
//======================================================================

var destCP0 = '.';
var destCP1 = destCP0 + '/afoevents';
var destCP2 = destCP0 + '/afopaniers';
var destCP3 = destCP0 + '/aforegistry';
var destCP4 = destCP0 + '/apigateway';
var destCP5 = destCP0 + '/authent';
var destCP6 = destCP0 + '/config';
var destCP7 = destCP0 + '/library';

function computeNewVersion() {
    return '2.' + Math.round(Date.now() / 1000);
}
let CSTE_AppVersion = computeNewVersion();

//======================================================================
// Creation du repertoire production
//======================================================================
gulp.task('default', ['push'], () => {
    console.log('default : Enter : ...');
    console.log('default : Leave : ...');
})

//======================================================================
//======================================================================
gulp.task('push', ['commit'], () => {
    console.log('push : Enter : ...');
    git.push('github', 'master');
    console.log('push : Leave : ...');
})

//======================================================================
//======================================================================
gulp.task('commit', ['add'], () => {
    console.log('commit : Enter : ...');
    git.commit('commit version : ' + CSTE_AppVersion);
    console.log('commit : Leave : ...');
})

//======================================================================
//======================================================================
gulp.task('add', ['cp1', 'cp2', 'cp3', 'cp4', 'cp5', 'cp6', 'cp7'], () => {
    console.log('add : Enter : ...');
    return gulp.src([
        './**'
    ])
        .pipe(git.add(function (err) {
            console.error('git.add : ' + destCP1 + ' : Enter ');
            if (err) {
                console.error('git.add : error : ', err);
            }
        }))
        .pipe(git.tag('v' + CSTE_AppVersion, 'Version message', function (err) {
            console.log('git.tag : ...');
            if (err)
                throw err;
        }));
});

//======================================================================
// afoevents
//======================================================================
gulp.task('cp1', ['root'], () => {
    // copier dans "production"
    console.log('cp1 : ...');
    makeDir.sync(destCP1);
    return gulp.src([
        '../afoevents/*.js',
        '../afoevents/*.json',
    ])
        .pipe(gulp.dest(destCP1))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP1 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP1 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// afopaniers
//======================================================================
gulp.task('cp2', ['root'], () => {
    // copier dans "production"
    console.log('cp2 : ...');
    makeDir.sync(destCP2);
    return gulp.src([
        '../afopaniers/*.js',
        '../afopaniers/*.json',
    ])
        .pipe(gulp.dest(destCP2))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP2 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP2 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// aforegistry
//======================================================================
gulp.task('cp3', ['root'], () => {
    // copier dans "production"
    console.log('cp3 : ...');
    makeDir.sync(destCP3);
    return gulp.src([
        '../aforegistry/*.js',
        '../aforegistry/*.json',
    ])
        .pipe(gulp.dest(destCP3))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP3 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP3 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// apigateway
//======================================================================
gulp.task('cp4', ['root'], () => {
    // copier dans "production"
    console.log('cp4 : ...');
    makeDir.sync(destCP4);
    return gulp.src([
        '../apigateway/*.js',
        '../apigateway/*.json',
    ])
        .pipe(gulp.dest(destCP4))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP4 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP4 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// authent
//======================================================================
gulp.task('cp5', ['root'], () => {
    // copier dans "production"
    console.log('cp5 : ...');
    makeDir.sync(destCP5);
    return gulp.src([
        '../authent/*.js',
        '../authent/*.json',
    ])
        .pipe(gulp.dest(destCP5))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP5 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP5 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// config
//======================================================================
gulp.task('cp6', ['root'], () => {
    // copier dans "production"
    console.log('cp6 : ...');
    makeDir.sync(destCP6);
    return gulp.src([
        '../config/*.json'
    ])
        .pipe(gulp.dest(destCP6))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP6 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP6 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
// library
//======================================================================
gulp.task('cp7', ['root'], () => {
    // copier dans "production"
    console.log('cp7 : ...');
    makeDir.sync(destCP7);
    return gulp.src([
        '../library/*.js',
        '../library/*.json',
    ])
        .pipe(gulp.dest(destCP7))
    // .pipe(git.add(function (err) {
    //     console.error('git.add : ' + destCP7 + ' : Enter ');
    //     if (err) {
    //         console.error('git.add : error : ', err);
    //     }
    // }))
    // .pipe(git.commit(() => {
    //     return 'commit : ' + destCP7 + ' : ' + CSTE_AppVersion
    // }));
});
//======================================================================
//======================================================================
gulp.task('root', ['init'], () => {
    // copier dans "production"
    console.log('root : ...');
    //makeDir.sync(destCP0);
});
//======================================================================
//======================================================================
gulp.task('init', function () {
    console.log('init repos : Enter');
    // git.addRemote('TFS', 'http://apulcino:afwinw!se4@stid-vtfs2013.afp.local:8080/tfs/SICL/MSAFO/_git/production', function (err) {
    //     if (err) {
    //         console.error('git.addRemote : error : ', err);
    //     }
    // })
    console.log('init repos : Leave');
});