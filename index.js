#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander');
const fs = require('fs');
const redirectUploader = require('./redirect-uploader')

const object = {
    googleSpreadsheetClientEmail : process.env.GOOGLE_SPREADSHEET_CLIENT_EMAIL,
    googleSpreadsheetPrivateKey : process.env.GOOGLE_SPREADSHEET_PRIVATE_KEY,
    googleSpreadsheetPrivateID : process.env.GOOGLE_SPREADSHEET_ID,
    googleSpreadsheetPrivateRange : process.env.GOOGLE_SPREADSHEET_RANGE,
    webconfigFileDirectory : process.env.WEBCONFIG_FILE_DIRECTORY
};

program
    .version('0.1.0')
    .option('-k, --key [key]', 'Sets spreadsheet private key')
    .option('-e, --email [email]', 'Sets spreadsheet client email' )
    .option('-i, --id [id]' , 'Sets spreadsheet id')
    .option('-r, --range [range]', 'Sets spreadsheet range')
    .option('-d, --dir [dir]', 'Sets webconfig directory')
    .option('-s, --set-keyfile-dir [keyfile]', 'Sets google keys file directory')
    .parse(process.argv);

if (program.setKeyfileDir){
    console.log('Google keys file directory is set', program.setKeyfileDir);
    const keysRawObject = fs.readFileSync(program.setKeyfileDir,'utf-8');
    const keysObject = JSON.parse(keysRawObject);
    object.googleSpreadsheetClientEmail = keysObject.client_email;
    object.googleSpreadsheetPrivateKey = keysObject.private_key;
    if (!object.googleSpreadsheetPrivateID) {
        object.googleSpreadsheetPrivateID = program.id;
    }
    if (!object.googleSpreadsheetPrivateRange) {
        object.googleSpreadsheetPrivateRange = program.range;
    }
    if (!object.WebconfigBuildDirectory) {
        object.WebconfigBuildDirectory = program.dir;
    }
} else {
    if (!object.googleSpreadsheetClientEmail) {
        object.googleSpreadsheetClientEmail = program.email;
    }
    if (!object.googleSpreadsheetPrivateKey) {
        object.googleSpreadsheetPrivateKey = program.key;
    }
    if (!object.googleSpreadsheetPrivateID) {
        object.googleSpreadsheetPrivateID = program.id;
    }
    if (!object.googleSpreadsheetPrivateRange) {
        object.googleSpreadsheetPrivateRange = program.range;
    }
    if (!object.webconfigFileDirectory) {
        object.webconfigFileDirectory = program.dir;
    }
}

if (object.googleSpreadsheetClientEmail && object.googleSpreadsheetPrivateKey && object.googleSpreadsheetPrivateID && object.googleSpreadsheetPrivateRange && object.webconfigFileDirectory){

    console.log('All params are set, running redirect uploader');
    redirectUploader.redirectRun(object);
} else {
    console.log('Params missing:');
    if (!object.googleSpreadsheetClientEmail) {
        console.log('Client Email is not set');
    }
    if (!object.googleSpreadsheetPrivateKey) {
        console.log('Private Key is not set');
    }
    if (!object.googleSpreadsheetPrivateID) {
        console.log('Private ID is not set');
    }
    if (!object.googleSpreadsheetPrivateRange) {
        console.log('Spreadsheet Range is not set');
    }
    if (!object.webconfigFileDirectory) {
        console.log('Webconfig File Directory is not set');
    }
    console.log('To set params see readme or -h for help');
}
