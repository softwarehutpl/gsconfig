const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const ensureVariableExistence = (variable) => {
    if (!variable) {
        throw new Error('Variable doesn\'t exist');
    }
    return variable;
};

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
    return filePath;
};

const escapeInvalidXMLCharacters = (text)  => text
    .replace(/&/g, '\\x26')
    .replace(/"/g, '\\x22');

const isValidRegExp = (exp) => {
    try {
        return new RegExp(exp);
    } catch (e) {
        return false;
    }
}

exports.redirectRun = async function (object) {
    try {
        const client = new google.auth.JWT(
            ensureVariableExistence(object.googleSpreadsheetClientEmail),
            null,
            ensureVariableExistence(object.googleSpreadsheetPrivateKey).replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets.readonly']
        );

        client.authorize(function (err, tokens) {
            if (err) {
                console.error(err);
            } else {
                googleSpreadSheetApiRun(client, object);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

async function googleSpreadSheetApiRun(client, object) {
    try {
        const googleSpreadSheetApi = google.sheets({version: 'v4', auth: client});

        const options = {
            spreadsheetId: ensureVariableExistence(object.googleSpreadsheetPrivateID),
            range: ensureVariableExistence(object.googleSpreadsheetPrivateRange)
        };

        const uploadedSpreadSheet = await googleSpreadSheetApi.spreadsheets.values.get(options);
        const uploadedSpreadSheetData = uploadedSpreadSheet.data.values;
        const uploadedSpreadSheetDataToSetChecked = uploadedSpreadSheetDataRulesNameValidation();

        function uploadedSpreadSheetDataRulesNameValidation () {
            const output = [];
            const sideHelper = new Set();
            for (let i in uploadedSpreadSheetData) {
                if(sideHelper.has(uploadedSpreadSheetData[i][0])) {
                    console.log('Redirect rule name ' + uploadedSpreadSheetData[i][0] +' occured more than once, it was deleted for proper build purposes')
                } else {
                    sideHelper.add(uploadedSpreadSheetData[i][0]);
                    output.push(uploadedSpreadSheetData[i])
                }
            }
            return output;
        }

        function createRedirectConfigRules() {
            let rules = '';

            for (let i in uploadedSpreadSheetDataToSetChecked) {
                const isValidRule = uploadedSpreadSheetDataToSetChecked[i][0]
                    && uploadedSpreadSheetDataToSetChecked[i][1]
                    && isValidRegExp(uploadedSpreadSheetDataToSetChecked[i][0])
                    && isValidRegExp(uploadedSpreadSheetDataToSetChecked[i][1]);

                if(isValidRule) {
                    rules +=
                        `<rule name="${escapeInvalidXMLCharacters(uploadedSpreadSheetDataToSetChecked[i][0])}">
                        <match url="${escapeInvalidXMLCharacters(uploadedSpreadSheetDataToSetChecked[i][0])}"/>
                        <action type="Redirect" url="${escapeInvalidXMLCharacters(uploadedSpreadSheetDataToSetChecked[i][1])}"/>
                    </rule>`
                }
            }
            rules = `<rules>${rules}</rules>`;
            return rules;
        }

        const webConfigString = fs.readFileSync(object.webconfigFileDirectory,'utf-8');
        const webConfigObject = convert.xml2js(webConfigString, {compact:true});
        const redirectsObject = convert.xml2js(createRedirectConfigRules(), {compact:true});

        function createNewWebconfigFile(){
            const rules = redirectsObject.rules.rule;
            console.log(rules);
            webConfigObject.configuration['system.webServer']['rewrite'].rules.rule.unshift(...(rules.length ? rules : [rules]));
            console.log(convert.js2xml(webConfigObject, {compact:true, spaces: 2}));
            return convert.js2xml(webConfigObject, {compact:true, spaces: 2});
        }

        fs.writeFileSync(ensureDirectoryExistence(object.webconfigFileDirectory),
            createNewWebconfigFile(),
            {flag: 'w'},
            function (err) {
                if (err) {
                    console.error(err);
                }
            });

    } catch(error){
        console.error(error);
    }
}
