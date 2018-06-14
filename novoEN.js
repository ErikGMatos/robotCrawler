const puppeteer = require('puppeteer');
const fs = require('fs');
var rimraf = require('rimraf');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    let arquivo = '';
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
   
 try{ 
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);
        
        console.log('iniciando conexão');
        
        const cpf = '104930926090000000000';
        
        console.log('acessando URL');
        
        await page.goto('http://sistemasenem.inep.gov.br/EnemSolicitacao/login.seam');
        
        console.log('inserindo dados');
        
        // Faz login no site
        await page.type('#username', '191010104484'); 
        await page.type('#password', 'UniSL2016');
        await page.click('input[type="image"]');
        
        console.log('fazendo login');
        
        // Busca pela aba que contem a edicao do enem
        const resultsSelector = '#LeftMenu #menugroup_4_3 #row_menugroup_4_3';
        await page.waitForSelector(resultsSelector);
        await page.click(resultsSelector);
        
        //Escolhe a opção de pesquisa por CPF
        const ano = '#j_id50';
        await page.click(ano);
        
        console.log('pesquisando CPF');
        
        //Preenche o input com o CPF a ser pesquisado
        const campoDigitarCPF = '#formularioForm';
        await page.waitForSelector(campoDigitarCPF);
        
        // Inicia a pesquisa
        await page.type('#formularioForm input[type="text"]', cpf); 
        //await timeout(2000);
        console.log('digitando CPF');
        await page.click('#formularioForm input[type="image"]');
        console.log('Iniciando Pesquisa');
        // Busca a tabela com as informações
        const tabelaInscrito = '#resultadoForm';
        console.log('aguardando tabela');
        await page.waitForSelector(tabelaInscrito);
        //await timeout(2000);
        const slavar = "#resultadoForm input[type='image']";
        console.log('clicando em salvar');
        await page.click(slavar);
        console.log('aguardando retorno de sucesso');
        await page.waitForSelector('.infomsg');
        //await timeout(2000);
        console.log('indo pra relatorio de consultas');
        await page.click("#j_id57");
        console.log('aguardando tabela de relatorio de consultas');
        await page.waitForSelector("#listaSolicitacaoAtendidas");
        console.log('pegando numero do arquivo de texto');
        const seletorNome = await page.$('#listaSolicitacaoAtendidas tbody tr td');
        const nomeFaculdade = await page.evaluate(seletorNome => seletorNome.textContent.trim(), seletorNome);
        arquivo = nomeFaculdade;
       // arquivo = await page.evaluateHandle(() => document.querySelector('#listaSolicitacaoAtendidas tbody tr td').textContent.trim());
        //const aHandle = await page.evaluateHandle(() => document.querySelector('#listaSolicitacaoAtendidas tbody tr td:nth-last-child(1) a').href);
        console.log('setando pasta de download');
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: '../../../../../teste'});
        console.log(arquivo+'.txt');
        console.log('selecionando link');
        const reportLink = await page.$('#listaSolicitacaoAtendidas tbody tr td:nth-last-child(1) a');
        const href = await page.evaluate(reportLink => reportLink.href, reportLink);
        await page.evaluate(reportLink => reportLink.target = '_self', reportLink);
        
        await page.goto(href);
        //console.log(aHandle._remoteObject.value);
        //console.log(self);
        //console.log('clicando no link');
        //await timeout(2000);
        //reportLink.click();
        // console.log('lendo tabela');
        //console.log('\n'+'encerrando conexão >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

    } catch (error) {

        console.log('o erro foi: '+ error);
        
    }
    await timeout(100);

    fs.exists('./teste/'+arquivo+'.txt',function(exists){
        if(exists){

            fs.mkdir('./teste/Pasta'+arquivo, function (err) {
                if (err) {
                    console.log('failed to create directory', err);
                } else {
                    fs.rename('./teste/'+arquivo+'.txt', './teste/Pasta'+arquivo+'/'+arquivo+'.txt', (err) => {
                        if (err){
                            throw err;
                            console.log('Rename complete!');
                        } else{
                            fs.readFile('./teste/Pasta'+arquivo+'/'+arquivo+'.txt', 'utf8', function(err,data){
                                if(err) {
                                    console.error("Could not open file: %s", err);
                                    
                                }else{

                                    var myArray =[];
                                    var teste = data.split(';');
                                    var obj = {
                                        inscricao: teste[0],
                                        cpf: teste[1],
                                        nome: teste[2],
                                        natutecnologia: teste[3],
                                        humatecnologia: teste[4],
                                        linguagens: teste[5],
                                        matematica: teste[6],
                                        redacao: teste[7]
                                    }
                                    myArray.push(obj);
                                    console.log(myArray);
                                    rimraf('./teste/Pasta'+arquivo, function () {    
                                        console.log('Removeu pasta');
                                    });
                                }
                            });
                        }
                    });
                }
            });
            }else{
                fs.exists('./teste/'+arquivo+'.txt.crdownload',function(exists){
                
                    if(exists){
                        fs.mkdir('./teste/Pasta'+arquivo, function (err) {
                            if (err) {
                                console.log('failed to create directory', err);
                            } else {
                                fs.rename('./teste/'+arquivo+'.txt.crdownload', './teste/Pasta'+arquivo+'/'+arquivo+'.txt.crdownload', (err) => {
                                    if (err) {
                                        throw err;
                                        console.log('Rename complete!');
                                    } else{
                                        fs.readFile('./teste/Pasta'+arquivo+'/'+arquivo+'.txt.crdownload', 'utf8', function(err,data){
                                            if(err) {
                                                console.error("Could not open file: %s", err);
                                                
                                            }else{

                                                var myArray =[];
                                                var teste = data.split(';');
                                                var obj = {
                                                    inscricao: teste[0],
                                                    cpf: teste[1],
                                                    nome: teste[2],
                                                    natutecnologia: teste[3],
                                                    humatecnologia: teste[4],
                                                    linguagens: teste[5],
                                                    matematica: teste[6],
                                                    redacao: teste[7]
                                                }
                                                myArray.push(obj);
                                                console.log(myArray);
                                                rimraf('./teste/Pasta'+arquivo, function () {    
                                                    console.log('Removeu pasta');
                                                });
                                               
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        return
                    }
                
            });
        }
    });
    await browser.close();
})();
