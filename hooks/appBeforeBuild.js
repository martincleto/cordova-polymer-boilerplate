#!/usr/bin/env node

/*
 * Nodejs script to run the polymer-cli `build` command into the polymer app root folder
 */

const path = require('path');
const { exec } = require('child_process');

const { polymerAppName, polymerAppPath } = require('../app.config.js');
const targetPathPieces = polymerAppPath.split('/');
const cwd = path.join(...targetPathPieces);
const buildCmd = exec('polymer build', { cwd: cwd });

buildCmd.stdout.on('data', (data) => {
  console.log(`${polymerAppName} stdout: ${data}`);
});

buildCmd.stderr.on('data', (data) => {
  console.log(`${polymerAppName} stderr: ${data}`);
});

buildCmd.on('close', (code) => {
  console.log(`${polymerAppName} child process exited with code ${code}`);
});