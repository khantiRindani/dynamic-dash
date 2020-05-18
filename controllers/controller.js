const path = require('path');
const NodeCache = require('node-cache');
const {readSites,readSitesWithCategory} = require("../utils/siteList");

const takePicture = require('../utils/backgroundPuppet');
const fs = require('fs');
const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10)); // ~10y

function pushData(site){

}
//Capture image only if not cached
async function captureImage(site){
    if(dashCash.has(site.site_name)){
//        pushData(site);
        return;
    }
    try{
        console.log(`capturing image: ${site.site_name}`);
        await takePicture([site])
//        pushData(site);
        dashCash.set(site.site_name,site);
    }catch(e){
        console.log('Error in puppet',e);
        return;
    }
}
exports.captureImage = captureImage;

exports.loadOrRetrieveCookies = function(req,res){
    //For first time access: set cookie
    if(req.cookies.sites === undefined){
        let sites = readSites();
        res.cookie('sites', sites, {expires: farFuture});
        let sitesCat = readSitesWithCategory();
        res.cookie('sitesCat', sitesCat, {expires: farFuture});
    }
    //For repetetive access: retrieve cookies
    else{
        res.cookie('sites',req.cookies.sites, {expires: farFuture});
        res.cookie('sitesCat',req.cookies.sitesCat, {expires: farFuture});
    }
}

//Setup cache
const ttl = 60*10; //10 minutes
const dashCash = new NodeCache({
    stdTTL: ttl,
    checkperiod: 100
});
dashCash.on("del", function(key, value) {
    try {
        console.log("Expired: cache updated");
        captureImage(value);
    } catch (e) {
        console.log(e);
    }
});
