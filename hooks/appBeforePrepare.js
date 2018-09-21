#!/usr/bin/env node

/*
 * This script checks provided config and Cordova source path stats
 * It generates the Polymer App build and then creates the symlink to it (if needed)
 */

// check config

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const { cordovaSrcPath,
        polymerAppName,
        polymerAppPath,
        polymerBuildPath } = require('../app.config.js');

let errorMsg = '';

function exitWith(code, msg) {
    const _msg = (code === 0)? `Error: ${msg}` : msg;

    console.log(msg);
    process.exit(code);
}

function isValidConfig() {
    if (!cordovaSrcPath) {
        errorMsg = 'Please set a value for cordovaSrcPath';
        return false;
    }

    if (!polymerAppName) {
        errorMsg = 'Please set a value for polymerAppName';
        return false;
    }

    if (!polymerAppPath) {
        errorMsg = 'Please set a value for polymerBuildPath';
        return false;
    }

    if (!polymerBuildPath) {
        errorMsg = 'Please set a value for polymerBuildPath';
        return false;
    }

    return true;
}

if (!isValidConfig()) {
    exitWith(0,`${errorMsg} in app.config.js file.`);
}

// check Cordova source directory and Polymer App paths

const srcPathPieces = cordovaSrcPath.split('/');
const srcDirPath = path.join(...srcPathPieces);

const targetPathPieces = polymerAppPath.split('/');
const targetPath = path.join(...targetPathPieces);

function isValidPath(path) {
    if (!fs.existsSync(path) || path === '.') {
        errorMsg = `Entered path ${path} does not exist or it is not valid`;
        return false;
    }

    return true;
}

if (!isValidPath(srcDirPath) || !isValidPath(targetPath)) {
    exitWith(0,`${errorMsg}.\nPlease check provided value in app.config.js file`);
}

// if needed, replace Cordova default source directory with a symlink to Polymer App build
// otherwise build the Polymer App normally

const buildPathPieces = polymerBuildPath.split('/');
const buildPath = path.join(targetPath, ...buildPathPieces);

function runPolymerAppBuild () {
    return new Promise((resolve, reject) => {
        const buildCmd = exec('polymer build', { cwd: targetPath });

        console.log(`Running ${polymerAppName} build...`);

        buildCmd.stdout.on('data', data => {
            console.log(`${polymerAppName} ${data}`);
        });

        buildCmd.stderr.on('data', data => {
            console.log(`${polymerAppName} ${data}`);
            reject(`${polymerAppName} ${data}`);
        });

        buildCmd.on('close', code => {
            resolve(`${polymerAppName} build process exited with code ${code}`);
        });
    });
}

function onBuildSucessCreateSymlink (createSymlink, successMsg) {
    if (createSymlink) {
        fs.symlinkSync(buildPath, srcDirPath);
    }

    const cordovaCmd = process.argv[2];

    if (cordovaCmd && cordovaCmd !== 'run') {
        exitWith(1, successMsg);
    }
}

fs.lstat(cordovaSrcPath, (err, stats) => {
    if (err) {
        exitWith(0, err);
        return;
    }

    let build;

    if (stats.isDirectory()) {
        console.log(`Removing ${srcDirPath}...`);
        fs.rmdirSync(srcDirPath);

        build = runPolymerAppBuild();

        build.then(successMsg => {
            onBuildSucessCreateSymlink(true, successMsg);
        });
    } else {
        build = runPolymerAppBuild();
        
        build.then(successMsg => {
            onBuildSucessCreateSymlink(false, successMsg);
        });
    }

    build.catch(errorMsg => {
        exitWith(0, errorMsg);
    });
});
