const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
    
    try {
        console.log('iniciando conexão...');
        const browser = await puppeteer.launch({headless: true});//, args: ['--start-fullscreen']
        const page = await browser.newPage();
        //page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);

        async function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const cidade ='araucaria';
        console.log('acessando...');
        await page.goto('https://querobolsa.com.br/');
        const inputDigita = await page.waitForSelector('span.select2-selection.select2-selection--single');
        inputDigita.click();
        const inputCidade = '.select2-search.select2-search--dropdown';
        await page.waitForSelector(inputCidade);
        await page.type(inputCidade, cidade , {delay: 100});
        const liDaLista = await page.waitForSelector('.select2-results__option.select2-results__option--highlighted');
        liDaLista.click();
        const btn = await page.$('button.pgc-btn.pgc-btn--main.pgc-btn--block.js-btn-lead');
        btn.click();
        await timeout(5000);
        const fechar = await page.waitForSelector('.close-btn .close', {visible:true});
        await timeout(5000);
        const cidadeEscolhida = await page.$('#select2--container.select2-selection__rendered');
        const cidadeEscolhidaNome = await page.evaluate(cidadeEscolhida => cidadeEscolhida.innerText, cidadeEscolhida);
        fechar.click(); //if you look in the browswer will see that it returns more than 700 pages, and I want to sweep them all.
        console.log('criando arquivo csv...');
        await fs.writeFile('queroBolsa/'+cidadeEscolhidaNome+'.csv', 'Faculdade,Curso,Tipo,Turno,Modalidade,Local,Preco,Desconto em %,Valor cheio,\n');
        var array = [];
        await LoopFunction();
       
        async function LoopFunction() { 
           
            try {

                const sections = await page.$$('#courses-table .plp-card.js-plp-card');
                
                for (let i = 0; i < sections.length; i++){

                    const sections = await page.$$('#courses-table .plp-card.js-plp-card');
                    const paginaAtualSeleteor = await page.$('.page.current');
                    const paginaAtualNome = await page.evaluate(paginaAtualSeleteor => paginaAtualSeleteor.innerText, paginaAtualSeleteor);

                    console.log(sections.length +'\n');
                    console.log(paginaAtualNome +'\n');
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

                    const seletorNumDesconto = await section.$('.plp-card.js-plp-card .plp-card-pricing .plp-card-pricing__display');
                    const nomeNumDesconto = await page.evaluate(seletorNumDesconto => seletorNumDesconto.innerText, seletorNumDesconto);

                    const seletorLinkBolsa = await section.$('.plp-card.js-plp-card .plp-card-pricing .plp-card-pricing__cta.js-plp-card-pricing__cta.pgc-btn.pgc-btn--block.pgc-btn--main');
                    const nomeLinkBolsa = await page.evaluate(seletorLinkBolsa => seletorLinkBolsa.href, seletorLinkBolsa);

                    const seletorValorCheio = await section.$('.plp-card.js-plp-card .plp-card-pricing .plp-card-pricing__display');
                    const nomeValorCheio = await page.evaluate(seletorValorCheio => seletorValorCheio.innerText, seletorValorCheio);
                                       
                    await fs.appendFile('queroBolsa/'+cidadeEscolhidaNome +'.csv', `'${nomeFaculdade}','${nomeCurso}','${nomeTipo}','${nomeTurno}','${nomeModalidade}','${nomeLocal}','${nomePreco}','${nomeNumDesconto}','${nomeValorCheio}'\n`);
                    
                    console.log('Faculdade: ',nomeFaculdade +'\nCurso: ', nomeCurso + '\nTipo:', nomeTipo + '\nTurno:', nomeTurno
                    + '\nModalidade: ', nomeModalidade + '\nLocal: ',nomeLocal + '\nPreço: ', nomePreco + '\nDesconto %: ', nomeNumDesconto + '\nLink: ', nomeLinkBolsa + '\nValor sem desconto: ', nomeValorCheio);

                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                    var info = {};
                    info.faculdade  = nomeFaculdade;
                    array.push(info);
                }
                console.log(array);
                const nextBtn = await page.$('#paginator .qb-pagination img[alt="next_page"');

                if(nextBtn){

                    nextBtn.click(); 
                    await page.waitForSelector('#js-cog', {visible:false});
                    await timeout(2000);
                    await page.$$('#courses-table .plp-card.js-plp-card');
                    await LoopFunction();
                }else{

                    console.log('entrou no ELSE');
                }

            }catch (e){

                console.log('O erro foi do LOOP : ', e);
            }
        }

        console.log('\nTerminou :)!!!');
        await page.screenshot({path: 'screenshot.png'});
        await browser.close();

    } catch (e) {
        
        console.log('O erro foi : ', e);
    }
})();
