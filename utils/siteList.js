const {readFileSync} = require('fs');
var path = require('path');

function readSites() {
    return JSON.parse(readFileSync(path.join(__dirname, 'sites.json'))).sites;
}
module.exports = readSites;
