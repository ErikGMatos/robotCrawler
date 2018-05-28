const puppeteer = require('puppeteer');
const fs = require('fs-extra');


const timeout = async function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const loopFunction = async function(page, pageNumber) {
    console.log('back in loop fn', pageNumber);
    // make sure the page says the page
    await page.waitForFunction(`document.querySelector("#js-totals strong").innerText == ${pageNumber}`);
    const sections = await page.$$('#courses-table .plp-card.js-plp-card');
    // do all the sections all at once
    await Promise.all(sections.map(async (section) => {
        try {
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
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

            return {nomeFaculdade, nomeCurso, nomeTipo, nomeTurno, nomeModalidade, nomeLocal, nomePreco}
        } catch (e) {
            return e;
        }
    }));

    const nextBtn = await page.$('#paginator .qb-pagination img[alt="next_page"');
    if(nextBtn) {
        // waiting a second before clicking, seems allow it to keep going.
        await timeout(1000);
        await nextBtn.click();
        await loopFunction(page, ++pageNumber);
    } else {
        console.log('no next button found');
    }
};

(async function main() {
    
    try {
        
        const browser = await puppeteer.launch({headless: true});//, args: ['--start-fullscreen']
        const page = await browser.newPage();
        //page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);

        
        await page.goto('https://querobolsa.com.br/');
        const inputDigita = await page.waitForSelector('span.select2-selection.select2-selection--single');
        await inputDigita.click();
        const inputCidade = '.select2-search.select2-search--dropdown';
        await page.waitForSelector(inputCidade);
        await page.type(inputCidade, 'muriae');
        const liDaLista = await page.waitForSelector('.select2-results__option.select2-results__option--highlighted');
        await liDaLista.click();
        const btn = await page.$('button.pgc-btn.pgc-btn--main.pgc-btn--block.js-btn-lead');
        await btn.click();
        await timeout(5000);
        const fechar = await page.waitForSelector('.close-btn .close', {visible:true});
        await timeout(5000);
        await fechar.click(); //if you look in the browswer will see that it returns more than 700 pages, and I want to sweep them all.
        await loopFunction(page, 1);

        console.log('done recursive loop');
        await browser.close();

    } catch (e) {
        
        console.log('O erro foi : ', e);
    }

    
})();