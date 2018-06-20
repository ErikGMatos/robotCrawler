const puppeteer = require('puppeteer');
const fs = require('fs-extra');

var Funcao = (async function main() {
    
    try {
        let arraydedados = [];
        console.log('iniciando conexão...');
        const browser = await puppeteer.launch({headless: false});//, args: ['--start-fullscreen']
        const page = await browser.newPage();
        page.setViewport({width:1920, height: 1020});
        //page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);

        async function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const cidade ='sao francisco, bh';
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
        const teste1 = await page.$('.location-selector.js-search-location');
        const bolinha = await page.$('.lead-assistant__balloon.js-lead-assistant-balloon');
        if(bolinha) {
            const fecharbolinha = await page.$('.lead-assistant__close.js-lead-assistant-close');
            await timeout(5000);
            fecharbolinha.click();
            await timeout(5000);
            teste1.click();
            const inputTeste1 = '.select2-container.select2-container--link-golden-m.select2-container--open.location-selector__select2-container input';
            await page.waitForSelector(inputTeste1);
            await page.type(inputTeste1, cidade , {delay: 100});
            const liDaListateste1 = await page.waitForSelector('.select2-results__option.select2-results__option--highlighted');
            liDaListateste1.click();
            await timeout(5000);
            const e = await page.$('div.slider .js-radius-slider .noUi-handle.noUi-handle-lower');
            const box = await e.boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(200,0);
            await page.mouse.up();
            await timeout(5000);
            await LoopFunction();
        }else{
            const fechar = await page.waitForSelector('.close-btn .close', {visible:true});
            await timeout(5000);
            // const cidadeEscolhida = await page.$('#select2--container.select2-selection__rendered');
            // const cidadeEscolhidaNome = await page.evaluate(cidadeEscolhida => cidadeEscolhida.innerText, cidadeEscolhida);
            fechar.click(); //if you look in the browswer will see that it returns more than 700 pages, and I want to sweep them all.
            await timeout(5000);
            teste1.click();
            const inputTeste1 = '.select2-container.select2-container--link-golden-m.select2-container--open.location-selector__select2-container input';
            await page.waitForSelector(inputTeste1);
            await page.type(inputTeste1, cidade , {delay: 100});
            const liDaListateste1 = await page.waitForSelector('.select2-results__option.select2-results__option--highlighted');
            liDaListateste1.click();
            await timeout(5000);
            const e = await page.$('div.slider .js-radius-slider .noUi-handle.noUi-handle-lower');
            const box = await e.boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(200,0);
            await page.mouse.up();
            await timeout(5000);
            //await fs.writeFile('queroBolsa/'+cidadeEscolhidaNome+'.csv', 'Faculdade,Curso,Tipo,Turno,Modalidade,Local,Preco,Desconto em %,Valor cheio,\n');
            await LoopFunction();
        }
        
       
        async function LoopFunction() { 
           
            try {

                const sections = await page.$$('#courses-table .plp-card.js-plp-card');
                
                for (let i = 0; i < sections.length; i++){
                    let obj ={};
                    const sections = await page.$$('#courses-table .plp-card.js-plp-card');
                    const paginaAtualSeleteor = await page.$('.page.current');
                    const paginaAtualNome = await page.evaluate(paginaAtualSeleteor => paginaAtualSeleteor.innerText, paginaAtualSeleteor);

                    console.log(sections.length +'\n');
                    console.log(paginaAtualNome +'\n');
                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');

                    const section = sections[i];

                    const seletorNome = await section.$('.plp-card-university a.plp-card-university__name-link');
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
                    const nomePreco = await page.evaluate(seletorPreco => seletorPreco.innerText.split(' ')[1].replace(',','.'), seletorPreco);

                    const seletorNumDesconto = await section.$('.plp-card.js-plp-card .plp-card-pricing .plp-card-pricing__display');
                    const nomeNumDesconto = await page.evaluate(seletorNumDesconto => seletorNumDesconto.innerText.slice(0,2), seletorNumDesconto);

                    // const seletorLinkBolsa = await section.$('.plp-card.js-plp-card .plp-card-pricing .plp-card-pricing__cta.js-plp-card-pricing__cta.pgc-btn.pgc-btn--block.pgc-btn--main');
                    // const nomeLinkBolsa = await page.evaluate(seletorLinkBolsa => seletorLinkBolsa.href, seletorLinkBolsa);

                    const seletorValorCheio = await section.$('.plp-card-pricing .plp-card-pricing__display-dashed');
                    const nomeValorCheio = await page.evaluate(seletorValorCheio => seletorValorCheio.innerText.split(' ')[1].replace(',','.'), seletorValorCheio);
                                       
                    //await fs.appendFile('queroBolsa/'+cidadeEscolhidaNome +'.csv', `'${nomeFaculdade}','${nomeCurso}','${nomeTipo}','${nomeTurno}','${nomeModalidade}','${nomeLocal}','${nomePreco}','${nomeNumDesconto}','${nomeValorCheio}'\n`);
                    
                    console.log('Faculdade: ',nomeFaculdade +'\nCurso: ', nomeCurso + '\nTipo:', nomeTipo + '\nTurno:', nomeTurno
                    + '\nModalidade: ', nomeModalidade + '\nLocal: ',nomeLocal + '\nPreço: ', nomePreco + '\nDesconto %: ', nomeNumDesconto + '\nValor sem desconto: ', nomeValorCheio);

                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                    var dataAtual = dataAtualFormatada();
                    obj={
                        nomeOrigem:'QueroBolsa',
                        cidadeEscolhida:cidade,
                        nomeFaculdade:nomeFaculdade,
                        nomeCurso:nomeCurso,
                        nomeModalidade:nomeModalidade,
                        nomeTurno:nomeTurno,
                        nomeLocal:nomeLocal,
                        nomeValorCheio:nomeValorCheio,
                        nomeDescontoBolsa:nomeNumDesconto,
                        nomePreco:nomePreco,
                        nomeDataPesquisa: dataAtual,
                        nomeCidadeEscolhida: cidade.toLocaleUpperCase()
                    }

                    arraydedados.push(obj);
                }
                
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
        //await page.screenshot({path: 'screenshot.png'});
        await browser.close();
        return arraydedados;
 
    } catch (e) {
        
        console.log('O erro foi : ', e);
    }
});

async function SQLdados(){
    var dados = await Funcao();
    await funcaoGravarDados(dados);
   console.log("Dados Gravado com sucesso"); 
}

async function funcaoGravarDados(data){
    var sql = require('mssql');
    try {
        const pool = await sql.connect('mssql://sa:homologacao@201.000.000.000:40000/bancodedados');
        for (let i = 0; i < data.length; i++){  
            var dados = data[i];
            await sql.query`INSERT INTO dbo.PesquisaDeMercado (Origem,Faculdade,Curso,Modalidade,Turno,Local,PrecoSemDesconto,Bolsa,Preco,DataPesquisa,CidadePesquisa)
            VALUES (${dados.nomeOrigem},${dados.nomeFaculdade},${dados.nomeCurso},${dados.nomeModalidade},${dados.nomeTurno},
            ${dados.nomeLocal},${dados.nomeValorCheio},${dados.nomeDescontoBolsa},${dados.nomePreco},${dados.nomeDataPesquisa},${dados.nomeCidadeEscolhida})`;
            console.log('Gravando registro numero: '+(i+1)+' de '+data.length)
        }
        await sql.close();
    } catch (err) {
        console.log('Erro foi no Loop do Banco de dados: ',err);
    }
}

SQLdados();

function dataAtualFormatada(){
    var data = new Date();
    var dia = data.getDate();
    if (dia.toString().length == 1)
      dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
      mes = "0"+mes;
    var ano = data.getFullYear();  
    return dia+"/"+mes+"/"+ano;
}
