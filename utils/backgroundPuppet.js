const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

let browser;
async function startup(){
    browser = await puppeteer.launch({
        args: ['--no-sandbox',
        '--lang=en-US,en,gu',
        '--disable-setuid-sandbox',
        '--disable-devshm-usage',
        '--disable-accelarated-2d-canvas',
        '--disable-gpu']
    });
}
async function takePicture(sites){
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 720});
    for(let i=0;i<sites.length;i++){
        await page.goto(sites[i]["url"],{waitUntil: 'networkidle2',timeout:0});
        await page.screenshot({
            path: `public/images/${sites[i]["site_name"]}.jpeg`,
            type: 'jpeg',
            quality: 60});
    }
    await page.close();
}
startup();
process.on('exit',()=>{
    browser.close();
    console.log('safe exit');
});
module.exports = takePicture;
