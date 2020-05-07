const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

async function takePicture(sites){
    const browser = await puppeteer.launch({
        args: ['--no-sandbox',
        '--lang=en-US,en,gu',
        '--disable-setuid-sandbox',
        '--disable-devshm-usage',
        '--disable-accelarated-2d-canvas',
        '--disable-gpu']
    });
    const pixel = devices[ 'Pixel 2' ];
    const page = await browser.newPage();
    for(let i=0;i<sites.length;i++){
        console.log(sites[i]["url"]);
        console.log(sites[i].site_name.slice(-6))
        if(sites[i].site_name.slice(-6) === "mobile"){
            await page.emulate(pixel);
            //console.log('mobile puppet');
        }
        else await page.setViewport({width: 1280, height: 720});
        await page.goto(sites[i]["url"],{waitUntil: 'networkidle2',timeout:0});
        await page.screenshot({
            path: `public/images/${sites[i]["site_name"]}.jpeg`,
            type: 'jpeg',
            quality: 60});
    }
    await browser.close();
}

module.exports = takePicture;
