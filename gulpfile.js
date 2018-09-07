//======================================================================
// Task GULP for AFO v2
//======================================================================
var gulp = require('gulp');
var git = require('gulp-git');
var makeDir = require('make-dir');

//======================================================================
//======================================================================

var destCP0 = './production';
var destCP1 = destCP0 + '/afoevents';
var destCP2 = destCP0 + '/afopaniers';
var destCP3 = destCP0 + '/aforegistry';
var destCP4 = destCP0 + '/apigateway';
var destCP5 = destCP0 + '/authent';
var destCP6 = destCP0 + '/config';
var destCP7 = destCP0 + '/library';

//======================================================================
// Creation du repertoire production
//======================================================================
//gulp.task('default', ['cp1', 'cp2', 'cp3', 'cp4', 'cp5', 'cp6', 'cp7'], () => {
gulp.task('default', ['cp1'], () => {
    let CSTE_AppVersion;
    function computeNewVersion() {
        CSTE_AppVersion = '2.' + Math.round(Date.now() / 60000);
    }
    process.chdir('production');
    gulp.src('./production/*')
        //.pipe(computeNewVersion())
        .pipe(git.add(function (err) {
            console.error('git.add : Enter ');
            if (err) {
                console.error('git.add : error : ', err);
            }
        }))
    // .pipe(git.commit(() => { return 'commit : ' + CSTE_AppVersion }))
});

//======================================================================
// afoevents
//======================================================================
gulp.task('cp1', ['root'], () => {
    // copier dans "production"
    console.log('cp1 : ...');
    makeDir.sync(destCP1);
    return gulp.src([
        './afoevents/*.js',
        './afoevents/*.json',
    ])
        .pipe(gulp.dest(destCP1));
});
//======================================================================
// afopaniers
//======================================================================
gulp.task('cp2', ['root'], () => {
    // copier dans "production"
    console.log('cp2 : ...');
    makeDir.sync(destCP2);
    return gulp.src([
        './afopaniers/*.js',
        './afopaniers/*.json',
    ])
        .pipe(gulp.dest(destCP2));
});
//======================================================================
// aforegistry
//======================================================================
gulp.task('cp3', ['root'], () => {
    // copier dans "production"
    console.log('cp3 : ...');
    makeDir.sync(destCP3);
    return gulp.src([
        './aforegistry/*.js',
        './aforegistry/*.json',
    ])
        .pipe(gulp.dest(destCP3));
});
//======================================================================
// apigateway
//======================================================================
gulp.task('cp4', ['root'], () => {
    // copier dans "production"
    console.log('cp4 : ...');
    makeDir.sync(destCP4);
    return gulp.src([
        './apigateway/*.js',
        './apigateway/*.json',
    ])
        .pipe(gulp.dest(destCP4));
});
//======================================================================
// authent
//======================================================================
gulp.task('cp5', ['root'], () => {
    // copier dans "production"
    console.log('cp5 : ...');
    makeDir.sync(destCP5);
    return gulp.src([
        './authent/*.js',
        './authent/*.json',
    ])
        .pipe(gulp.dest(destCP5));
});
//======================================================================
// config
//======================================================================
gulp.task('cp6', ['root'], () => {
    // copier dans "production"
    console.log('cp6 : ...');
    makeDir.sync(destCP6);
    return gulp.src([
        './config/*.json'
    ])
        .pipe(gulp.dest(destCP6));
});
//======================================================================
// library
//======================================================================
gulp.task('cp7', ['root'], () => {
    // copier dans "production"
    console.log('cp7 : ...');
    makeDir.sync(destCP7);
    return gulp.src([
        './library/*.js',
        './library/*.json',
    ])
        .pipe(gulp.dest(destCP7));
});
//======================================================================
//======================================================================
gulp.task('root', ['init'], () => {
    // copier dans "production"
    console.log('root : ...');
    makeDir.sync(destCP0);
});
//======================================================================
//======================================================================
gulp.task('init', function () {
    console.log('init repos : Enter');
    git.init({ cwd: './production' }, function (err) {
        if (err) {
            console.error('git.init : error : ', err); git
        }
        git.addRemote('TFS', 'http://apulcino:afwinw!se4@stid-vtfs2013.afp.local:8080/tfs/SICL/MSAFO/_git/production', function (err) {
            if (err) {
                console.error('git.addRemote : error : ', err);
            }
        })
    });
    console.log('init repos : Leave');
});