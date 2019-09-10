#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander');
const fs = require('fs');
const redirectUploader = require('./redirect-uploader');

const defaultPrimaryWebConfigDir = './public/web.config';
const defaultTargetWebConfigDir = './build/web.config';
const defaultSpreadsheetRange = 'Arkusz1!A2:B';

const object = {
    googleSpreadsheetClientEmail : process.env.GOOGLE_SPREADSHEET_CLIENT_EMAIL,
    googleSpreadsheetPrivateKey : process.env.GOOGLE_SPREADSHEET_PRIVATE_KEY,
    googleSpreadsheetPrivateID : process.env.GOOGLE_SPREADSHEET_ID,
    googleSpreadsheetPrivateRange : process.env.GOOGLE_SPREADSHEET_RANGE,
    webconfigFilePrimaryDirectory : process.env.WEBCONFIG_FILE_PRIMARY_DIRECTORY,
    webconfigFileTargetDirectory : process.env.WEBCONFIG_FILE_TARGET_DIRECTORY,
};

program
    .version('1.2.0')
    .option('-k, --key [key]', 'Sets spreadsheet private key')
    .option('-e, --email [email]', 'Sets spreadsheet client email' )
    .option('-i, --id [id]' , 'Sets spreadsheet id')
    .option('-r, --range [range]', 'Sets spreadsheet range')
    .option('-pd, --primary-dir [primaryDir]', 'Sets primary webconfig directory')
    .option('-td, --target-dir [targetDir]', 'Sets target webconfig directory')
    .option('-s, --set-keyfile-dir [keyfile]', 'Sets google keys file directory')
    .parse(process.argv);

if (program.setKeyfileDir){
    console.log('Google keys file directory is set', program.setKeyfileDir);
    const keysRawObject = fs.readFileSync(program.setKeyfileDir,'utf-8');
    const keysObject = JSON.parse(keysRawObject);
    object.googleSpreadsheetClientEmail = keysObject.client_email;
    object.googleSpreadsheetPrivateKey = keysObject.private_key;

} else {
    if (!object.googleSpreadsheetClientEmail) {
        object.googleSpreadsheetClientEmail = program.email;
    }
    if (!object.googleSpreadsheetPrivateKey) {
        object.googleSpreadsheetPrivateKey = program.key;
    }
}

if (!object.googleSpreadsheetPrivateID) {
    object.googleSpreadsheetPrivateID = program.id;
}
if (!object.googleSpreadsheetPrivateRange) {
    object.googleSpreadsheetPrivateRange = program.range || defaultSpreadsheetRange;
}
if (!object.webconfigFilePrimaryDirectory) {
    object.webconfigFilePrimaryDirectory = program.primaryDir || defaultPrimaryWebConfigDir;
}
if (!object.webconfigFileTargetDirectory) {
    object.webconfigFileTargetDirectory = program.targetDir || defaultTargetWebConfigDir;
}

if (object.googleSpreadsheetClientEmail && object.googleSpreadsheetPrivateKey && object.googleSpreadsheetPrivateID && object.googleSpreadsheetPrivateRange){

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
    console.log('To set params see readme or -h for help');
}
