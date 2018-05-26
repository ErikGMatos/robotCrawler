const puppeteer = require('puppeteer');

(async function main() {
    
    try {
        
        const browser = await puppeteer.launch({headless: false, args: ['--start-fullscreen']});
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        
        await page.goto('https://experts.shopify.com/');
        await page.waitForSelector('.section');
        const sections = await page.$$('.section');
        
        async function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        for (let i = 0; i < sections.length; i++){

            await page.goto('https://experts.shopify.com/');
            await page.waitForSelector('.section');
            const sections = await page.$$('.section');


            const section = sections[i];
            const button = await section.$('a.marketing-button');
            const buttonName = await page.evaluate(button => button.innerText, button);
            console.log('\n\n');
            console.log(buttonName);
            button.click();

            await page.waitForSelector('#ExpertsResults');
            await timeout(5000);
            const lis = await page.$$('#ExpertsResults > li ');
            console.log(lis.length);


            for (const li of lis){
                const name = await li.$eval('h2', h2 => h2.innerText);
                console.log('nome ',name);
            }

            
            
        }
        await page.screenshot({path: 'example.png'});
        await page.screenshot({path: 'screenshot.png'});
        await browser.close();

    } catch (e) {
        
        console.log('O erro foi : ', e);
    }

    
})();