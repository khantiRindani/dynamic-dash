const path = require('path');
const NodeCache = require('node-cache');
const {readSites,readSitesWithCategory} = require("../utils/siteList");

const takePicture = require('../utils/backgroundPuppet');
const fs = require('fs');
const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10)); // ~10y

//Capture image only if not cached
async function captureImage(site,client){
    if(dashCache.has(site.site_name)){
        if(dashCache.get(site.site_name).clients.includes(client))
            return;
        clients = dashCache.get(site.site_name).clients
        clients.push(client);
        dashCache.set(site.site_name,{site:site,clients:clients});
        return;
    }
    try{
        console.log(`capturing image: ${site.site_name}`);
        await takePicture([site])
        if(typeof(client)==="object"){
            dashCache.set(site.site_name,{site:site,clients:client});
            for(cli of client)
                io.to(cli).emit("Image",{'site': site});
        }
        else {
            dashCache.set(site.site_name,{site:site,clients:[`${client}`]});
            io.to(client).emit("Image",{'site': site});
        }
    }catch(e){
        console.log('Error in puppet',e);
        return;
    }
    //console.log(dashCache.get(site.site_name));
}
exports.captureImage = captureImage;

exports.loadOrRetrieveCookies = function(req,res){
    let sitesCat;
    //For first time access: set cookie
    if(req.cookies.sites === undefined){
        let sites = readSites();
        res.cookie('sites', sites, {expires: farFuture});
        sitesCat = readSitesWithCategory();
        res.cookie('sitesCat', sitesCat, {expires: farFuture});
    }
    //For repetetive access: retrieve cookies
    else{
        res.cookie('sites',req.cookies.sites, {expires: farFuture});
        sitesCat = req.cookies.sitesCat;
        res.cookie('sitesCat',req.cookies.sitesCat, {expires: farFuture});
    }
}

//Setup cache
const ttl = 60*10; //10 minutes
const dashCache = new NodeCache({
    stdTTL: ttl,
    checkperiod: 100
});
dashCache.on("del", function(key, value) {
    try {
        console.log("Expired: cache updated");
        captureImage(value.site,value.clients);
    } catch (e) {
        console.log(e);
    }
});
exports.io_startup = function(io){
    io.sockets.on('connection', function(socket){
      console.log(`A new WebSocket connection has been established:`);
      console.log(socket.client.id);

      socket.on('disconnect', function(){
        console.log('A WebSocket got dis-connected');
        for(key of dashCache.keys()){
            if(dashCache.get(key).clients.includes(socket.client.id)){
                for(var i=0; i<dashCache.get(key).clients.length; i++){
                    if(dashCache.get(key).clients[i]===socket.client.id)
                        break;
                }
                dashCache.get(key).clients.splice(i,1);
            }
        }
      });
    });
}
