const {readFileSync} = require('fs');
var path = require('path');

exports.readSites = function(){
    return JSON.parse(readFileSync(path.join(__dirname, 'sites.json'))).sites;
};

exports.readSitesWithCategory = function(){
    return JSON.parse(readFileSync(path.join(__dirname, 'sites.json'))).sitesCat;
};
