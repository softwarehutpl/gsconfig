
# gsConfig

Move your http 301 redirect rules from `web.config` to *Google Spredsheet*

## Pre-requirements
- IIS server with .NET framework which uses web.config for server configuration
- Google Account with configured Google Sheets API and created credentials
- Google Spreadsheet


## Instalation
`npm install @softwarehutpl/gsconfig -s`

or globaly

`npm install @softwarehutpl/gsconfig -s -g`

## Usage

To use the package, you need to provide data to connect with Google Sheets API and paths to primary and target web.config file.

####JSON file
You can specify some data in JSON file

```
{
  "client_email": "googleSpreadsheetClientEmail",
  "private_key": "googleSpreadsheetPrivateKey"
}
```
and run script
```$xslt
gsconfig --id="googleSpreadsheetPrivateID"  --range="googleSpreadsheetPrivateRange" --primary-dir="primaryWebconfigDirectory/web.config" --target-dir="targetWebconfigDirectory/web.config"  --set-keyfile-dir="keyfileDirectory/keys.json"
```

####command options
You can provide all data in command options and run script
```
gsconfig --key="googleSpreadsheetPrivateKey" --email="googleSpreadsheetClientEmail" --id="googleSpreadsheetPrivateID"  --range="googleSpreadsheetPrivateRange" --primary-dir="./primaryWebconfigDirectory" --target-dir="./targetWebconfigDirectory" 
```

####environment variables
Or provide data in environment variables and run
```
gsconfig
```


Created web.config file will be in the specified build directory.
