const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
    
    try {
        console.log('iniciando conexão...');
        const browser = await puppeteer.launch({headless: false,args: ['--start-fullscreen']});
        const page = await browser.newPage();
        page.setViewport({width:1920, height: 1020});
        //page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);

        async function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        console.log('acessando...');
        await page.goto('https://www.educamaisbrasil.com.br/');
        await page.waitForSelector('#loading', {visible:false});
        await timeout(2000);
        const inputDigita = await page.$('span.ui-select-match-text.pull-left');
        inputDigita.click();
        const inputCidade = '#listaInstituicoes input';
        await page.waitForSelector(inputCidade);
        await page.type(inputCidade, 'jacarei ' , {delay: 100});
        const liDaLista = await page.waitForSelector('.ui-select-choices-row.active');
        liDaLista.click();
        await page.waitForSelector('#loading', {visible:false});
        await timeout(2000);
        var indice = 1;
        

        
        await timeout(1000);
        //const cidadeEscolhida = await page.$('#sel_cidade div span span:last-child');
        //const cidadeEscolhidaNome = await page.evaluate(cidadeEscolhida => cidadeEscolhida.innerText, cidadeEscolhida);
        
        await fs.writeFile('educamais/teste.csv', 'Faculdade,Curso,Modalidade,Turno,Local,Valor cheio,Bolsa,Preço\n');
        await Loop1();

        async function Loop1() { 

            try {

                const curosDisponiveis = await page.$$('#SuperiorPos .boxInstitucaoHome .lnkCursosDisponiveis span');
               
                const setaDireita = await page.$('.carrosselBoxes-helpers .seta.seta-dir');

                for (let k = 0; k < curosDisponiveis.length; k++){
                    await timeout(4000);
                    const curosDisponiveis = await page.$$('#SuperiorPos .boxInstitucaoHome .lnkCursosDisponiveis span');
                    if(indice > 4){
                    const setaDireita = await page.$('.carrosselBoxes-helpers .seta.seta-dir');
                    setaDireita.click();
                    await timeout(2000);
                    
                    
                    }else if (indice >8){
                    const setaDireita = await page.$('.carrosselBoxes-helpers .seta.seta-dir');
                    setaDireita.click();
                    await timeout(2000);
                    setaDireita.click();
                    
                    }

                    const next = curosDisponiveis[k];
                    next.click();
                    
                    await timeout(5000);
                    console.log(curosDisponiveis.length +' cursos disponiveis\n');
                    console.log(indice +' indice\n');
                   
                    await timeout(5000);
                    await LoopFunction();

                    async function LoopFunction() { 
                        
                        try {
                            await page.waitForSelector('#loading', {visible:false});
                            await timeout(2000);
                            const sections = await page.$$('#listaCursoSuperior .item-graduacao');
                            
                            //let faculdadesPesquisar = $$('#SuperiorPos .boxInstitucaoHome:nth-child('+indice+')');
                            for (let i = 0; i < sections.length; i++){
                                
                                const sections = await page.$$('#listaCursoSuperior .item-graduacao');
                                const paginaAtualSeleteor = await page.$('.paginacao li.active a');
                                const paginaAtualNome = await page.evaluate(paginaAtualSeleteor => paginaAtualSeleteor.innerText, paginaAtualSeleteor);
                                
                                console.log(sections.length +'\n');
                                console.log(paginaAtualNome +'\n');
                                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                                
                                const section = sections[i];
                                
                                const seletorNome = await section.$('.campo.instituicao a');
                                const nomeFaculdade = await page.evaluate(seletorNome => seletorNome.innerText, seletorNome);
                                
                                const seletorCurso = await section.$('.campo.curso a');
                                const nomeCurso = await page.evaluate(seletorCurso => seletorCurso.innerText, seletorCurso);
                                
                                const seletorModalidade = await section.$('.campo.tags span:first-child');
                                const nomeModalidade = await page.evaluate(seletorModalidade => seletorModalidade.innerText, seletorModalidade);
                                
                                const seletorTurno = await section.$('.campo.tags span:last-child');
                                const nomeTurno = await page.evaluate(seletorTurno => seletorTurno.innerText, seletorTurno);
                                
                                const seletorLocal = await section.$('.campo.bairro span:last-child');
                                const nomeLocal = await page.evaluate(seletorLocal => seletorLocal.innerText, seletorLocal);
                                
                                const seletorValorCheio = await section.$('.campo.valor span:first-child');
                                const nomeValorCheio = await page.evaluate(seletorValorCheio => seletorValorCheio.innerText.split(' ')[1], seletorValorCheio);
                                
                                const seletorDescontoBolsa = await section.$('.campo.bolsa .destaque');
                                const nomeDescontoBolsa = await page.evaluate(seletorDescontoBolsa => seletorDescontoBolsa.innerText, seletorDescontoBolsa);
                                
                                const seletorPreco = await section.$('.campo.valor .info.cor .destaque');
                                const nomePreco = await page.evaluate(seletorPreco => seletorPreco.innerText, seletorPreco);
                                
                                const seletorPrecoCentavos = await section.$('.campo.valor .info.cor strong');
                                const nomePrecoCentavos = await page.evaluate(seletorPrecoCentavos => seletorPrecoCentavos.innerText, seletorPrecoCentavos);
                                
                                await fs.appendFile('educamais/teste.csv', `'${nomeFaculdade}','${nomeCurso}','${nomeModalidade}','${nomeTurno}','${nomeLocal}','${nomeValorCheio}','${nomeDescontoBolsa}','${nomePreco}${nomePrecoCentavos}'\n`);
                                
                                console.log('Faculdade: ',nomeFaculdade + '\nCurso: ', nomeCurso + '\nModalidade: ', nomeModalidade + '\nTurno: ', nomeTurno + '\nLocal: ', nomeLocal + '\nValor sem desconto: ', nomeValorCheio + '\nBolsa: ', nomeDescontoBolsa +'%' + '\nPreço: ', nomePreco+nomePrecoCentavos);
                                
                                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                            }
                            
                            const nextBtn = await page.$('.paginacao li:nth-last-child(2) a');
                            const nextBtnFIM = await page.$('.paginacao li.disabled:nth-last-child(2) a');
                            
                            if(nextBtnFIM === null){
                            
                                nextBtn.click(); 
                                await timeout(2000);
                                
                                await LoopFunction();
                            }else{
                                
                                console.log('entrou no ELSE');
                                
                            }
                            
                        }catch (e){
                            
                            console.log('O erro foi do LOOP : ', e);
                        }
                    }


                    indice++;
                   
                    //await timeout(5000);
                    await page.goto('https://www.educamaisbrasil.com.br/');
                    await page.waitForSelector('#loading', {visible:false});

                }
                
            }
            
            catch (e) {
               console.log('O erro foi no LOOP1', e.stack);
           }
            
                
        }

        console.log('\nTerminou :)!!!');
        await page.screenshot({path: 'screenshot.png'});
        //await browser.close();
            
        } catch (e) {
            
            console.log('O erro foi : ', e);
        }
    })();