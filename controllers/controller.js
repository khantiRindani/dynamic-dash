var path = require('path');
const NodeCache = require('node-cache');

const takePicture = require('../utils/backgroundPuppet');
const fs = require('fs');

async function captureImage(site){
    if(dashCash.has(site.site_name))
        return;
    try{
        console.log(`capturing image: ${site.url}`);
        await takePicture(site);
        dashCash.set(site.site_name,site);
    }catch(e){
        console.log('Error in puppet',e);
    }
}
exports.captureImage = captureImage;

const ttl = 60*10; //10 minutes
const dashCash = new NodeCache({
    stdTTL: ttl
});
dashCash.on("expired", function(key, value) {
    try {
        console.log("Expired: cache updated");
    } catch (e) {
        console.log(e);
    }
});
const readSites = require("../utils/siteList");
readSites().forEach((site,index,array)=>{
    captureImage(site);
});
