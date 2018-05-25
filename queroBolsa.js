const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log('iniciando conexão');
    
    
    console.log('acessando URL');
    
    await page.goto('https://querobolsa.com.br');
    
    console.log('inserindo dados');
    
    const resultsSelector = '.location-selector.js-location';
    await page.click(resultsSelector);
    console.log('escrevendo cidade');
    const inputCidade = '.select2-search.select2-search--dropdown';
    await page.waitForSelector(resultsSelector);
    await page.type(inputCidade, 'São Paulo - SP' , {delay: 200}); 
   
    console.log('clicando botao');
    const submit = 'button[type="submit]';
    await page.click(submit);


    


    
    
    console.log(await page.content());
    
    
    
    
    
    
    
    
    
    console.log('\n'+'encerrando conexão >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    await page.screenshot({path: 'example.png'});
    //Encerra conexão
    await browser.close();
})();