const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
    
    try {
        
        const browser = await puppeteer.launch({headless: true});//, args: ['--start-fullscreen']
        const page = await browser.newPage();
        //page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);

        async function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        
        
        await page.goto('https://querobolsa.com.br/');
        const inputDigita = await page.waitForSelector('span.select2-selection.select2-selection--single');
        inputDigita.click();
        const inputCidade = '.select2-search.select2-search--dropdown';
        await page.waitForSelector(inputCidade);
        await page.type(inputCidade, 'São Jose dos Campos' , {delay: 100});
        const liDaLista = await page.waitForSelector('.select2-results__option.select2-results__option--highlighted');
        liDaLista.click();
        const btn = await page.$('button.pgc-btn.pgc-btn--main.pgc-btn--block.js-btn-lead');
        btn.click();
        await timeout(5000);
        const fechar = await page.waitForSelector('.close-btn .close', {visible:true});
        await timeout(5000);
        fechar.click(); //if you look in the browswer will see that it returns more than 700 pages, and I want to sweep them all.
        //LoopFunction();

        // let LoopFunction = (async function () {           //Here is the loop that I know how to do
        //     console.log('iniciou o looping');
            const sections = await page.$$('#courses-table .plp-card.js-plp-card');

            for (let i = 0; i < sections.length; i++){
                const sections = await page.$$('#courses-table .plp-card.js-plp-card');
                console.log(sections.length +'\n');
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                const section = sections[i];

                const seletorNome = await section.$('.plp-card-university a.plp-card-university__name');
                const nomeFaculdade = await page.evaluate(seletorNome => seletorNome.innerText, seletorNome);

                const seletorCurso = await section.$('.plp-card-course a');
                const nomeCurso = await page.evaluate(seletorCurso => seletorCurso.innerText, seletorCurso);

                const seletorTipo = await section.$('.plp-card-course .plp-card-course__level');
                const nomeTipo = await page.evaluate(seletorTipo => seletorTipo.innerText, seletorTipo);
                
                const seletorTurno = await section.$('.plp-card-course .plp-card-course__info');
                const nomeTurno = await page.evaluate(seletorTurno => seletorTurno.innerText, seletorTurno);

                const seletorModalidade = await section.$('.plp-card-course .plp-card-course__info:nth-child(2)');
                const nomeModalidade = await page.evaluate(seletorModalidade => seletorModalidade.innerText, seletorModalidade);

                const seletorLocal = await section.$('.plp-card-course .plp-card-course__info.js-plp-card-campus-name');
                const nomeLocal = await page.evaluate(seletorLocal => seletorLocal.innerText, seletorLocal);

                const seletorPreco = await section.$('.plp-card-pricing .plp-card-pricing__display.js-plp-card-offered-price');
                const nomePreco = await page.evaluate(seletorPreco => seletorPreco.innerText, seletorPreco);

                console.log('Faculdade: ',nomeFaculdade +'\nCurso: ', nomeCurso + '\nTipo:', nomeTipo + '\nTurno:', nomeTurno
                + '\nModalidade: ', nomeModalidade + '\nLocal: ',nomeLocal + '\nPreço: ', nomePreco);
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
            }
        // });
        const nextBtn = await page.$('#paginator .qb-pagination img[alt="next_page"');
        if(nextBtn){
            nextBtn.click(); //here I check if there is the "NEXT" button that indicates that I have more pages to scan. 
                            //If I have it I want it to return to the previous loop ..... So what about the error...
            await page.$$('#courses-table .plp-card.js-plp-card');
            //LoopFunction();//I tried here to return to the LOOP, but without success = /
            console.log('foi pro looping');
        }else{
            console.log('entrou no ELSE');
        }
        
        console.log('\nTerminou :)!!!');
        await page.screenshot({path: 'screenshot.png'});
        await browser.close();

    } catch (e) {
        
        console.log('O erro foi : ', e);
    }

    
})();