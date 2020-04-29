const puppeteer = require('puppeteer');

async function takePicture(sites){
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        defaultViewport: {
            width: 1280,
            height: 720
        }
    });
    const page = await browser.newPage();
    for(let i=0;i<sites.length;i++){
        console.log(sites[i]["url"]);
        await page.goto(sites[i]["url"],{waitUntil: 'networkidle0'});
        await page.screenshot({path:`public/images/${sites[i]["site_name"]}.png`});
    }
    await browser.close();
}

module.exports = takePicture;
