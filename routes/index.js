var express = require('express');
var router = express.Router();

/* GET home page. */
var controller = require("../controllers/controller");
var readSites = require("../utils/siteList");

var farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10)); // ~10y

router.get('/', function(req, res, next) {
    if(req.cookies.sites === undefined){
        let sites = readSites();
        res.cookie('sites', sites, {expires: farFuture});
    }else{
        res.cookie('sites',req.cookies.sites, {expires: farFuture})
    }
    res.render('dashboard');
});

router.get('/thumb', function(req, res, next) {
    if(req.cookies.sites === undefined){
        let sites = readSites();
        res.cookie('sites', sites, {expires: farFuture});
    }else{
        res.cookie('sites',req.cookies.sites, {expires: farFuture})
    }
    res.render('dashboardThumb');
});

router.get('/demo', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/getImages', function(req, res, next) {
    let sites = req.cookies.sites;
    sites.forEach((site, index, array) => {
        controller.captureImage(site);
    });

    res.json(sites);
});

router.get('/addSite/:site/:url', function(req, res) {
    let sites = req.cookies.sites;
    let newSite = {
        "site_name": req.params.site,
        "url": req.params.url
    };
    sites.push(newSite);
    res.cookie('sites', sites, {expires: farFuture});
    res.json(newSite);
});

router.post('/addSite', async function(req,res){
    const sites = req.cookies.sites;
    const newSite = {
        "site_name": req.body.site,
        "url": req.body.url
    };
    await controller.captureImage([newSite]);
    sites.push(newSite);
    res.cookie('sites', sites, {expires: farFuture});
    res.json([newSite]);
});

router.delete('/deleteSite',function(req,res){
    const delSite = req.body.site;
    console.log(delSite);
    let sites = req.cookies.sites;
    for(var i=0; i<sites.length; i++){
        if(sites[i].site_name === delSite)
            break;
    }
    sites.splice(i,1);
    res.cookie('sites', sites, {expires: farFuture});
    res.json(sites);
});
module.exports = router;
