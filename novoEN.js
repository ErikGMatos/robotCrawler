const puppeteer = require('puppeteer');
const fs = require('fs');
var rimraf = require('rimraf');


var Funcao1 = (async (collapse, anolink, CPF, AnoReferencia, TempoDeEspera) => {
    var browser;
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let arquivo = '';
    try{ 
        await timeout(TempoDeEspera);
        browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);
        
        console.log('iniciando conexão');
        
        const cpf = CPF;
        
        console.log('acessando URL');
        
        await page.goto('http://sistemasenem.inep.gov.br/EnemSolicitacao/login.seam');
        
        console.log('inserindo dados');
        
        // Faz login no site
        await page.type('#username', '**'); 
        await page.type('#password', '**');
        await page.click('input[type="image"]');
        
        console.log('fazendo login');
        
        // Busca pela aba que contem a edicao do enem
        const resultsSelector = '#LeftMenu ' + collapse;
        await page.waitForSelector(resultsSelector);
        await page.click(resultsSelector);
        
        //Escolhe a opção de pesquisa por CPF
        const ano = anolink;
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
        try {
            const tabelaInscrito = '#resultadoForm';
            console.log('aguardando tabela');
            await page.waitForSelector(tabelaInscrito,{ timeout: 5000});
            
        } catch (error) {
            await browser.close();
            return 'CPF não encontrado para o ano: '+AnoReferencia;
        }
        
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
        console.log('setando pasta de download');
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: '../../../../../teste'});
        console.log(arquivo+'.txt');
        console.log('selecionando link');
        const reportLink = await page.$('#listaSolicitacaoAtendidas tbody tr td:nth-last-child(1) a');
        const href = await page.evaluate(reportLink => reportLink.href, reportLink);
        await page.evaluate(reportLink => reportLink.target = '_self', reportLink);
        
        await page.goto(href);

    } catch (error) {

       console.log('o erro foi: '+ error);
       
       await timeout(900);
        var meuArray = [];
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
                                       var teste = data.split(';');
                                       var obj = {
                                           anoPesquisado: AnoReferencia,
                                           inscricao: teste[0],
                                           cpf: teste[1],
                                           nome: teste[2],
                                           natutecnologia: teste[3],
                                           humatecnologia: teste[4],
                                           linguagens: teste[5],
                                           matematica: teste[6],
                                           redacao: teste[7]
                                       }
                                       
                                       meuArray.push(obj);
                                       console.log(meuArray);
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
                                                   
                                                    meuArray.push(obj);
                                                    console.log(meuArray);
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
  
    }
    await browser.close();
    return meuArray;
    //return myArray;
});

executaFuncoes('10493092609');

function executaFuncoes(cpfPesquisa) {
    var respostasFinal = [];
    return Promise.all([
        Funcao1('#menugroup_4_2 #row_menugroup_4_2','#j_id54',cpfPesquisa,'2009',0),
        Funcao1('#menugroup_4_3 #row_menugroup_4_3','#j_id50',cpfPesquisa,'2010',3000),
        Funcao1('#menugroup_4_4 #row_menugroup_4_4','#j_id46',cpfPesquisa,'2011',6000),
        Funcao1('#menugroup_4_5 #row_menugroup_4_5','#j_id42',cpfPesquisa,'2012',9000),
        Funcao1('#menugroup_4_6 #row_menugroup_4_6','#j_id38',cpfPesquisa,'2013',12000)
    ])
      .then(function (responses) { 
          respostasFinal.push(responses);
        return Promise.all([
        Funcao1('#menugroup_4_7 #row_menugroup_4_7','#j_id34',cpfPesquisa,'2014',0),
        Funcao1('#menugroup_4_8 #row_menugroup_4_8','#j_id30',cpfPesquisa,'2015',3000),
        Funcao1('#menugroup_4_9 #row_menugroup_4_9','#j_id26',cpfPesquisa,'2016',6000),
        Funcao1('#menugroup_4_10 #row_menugroup_4_10','#j_id22',cpfPesquisa,'2017',9000)
    ])
      .then(function (responses) { 
        respostasFinal.push(responses);
        
        console.log(respostasFinal);
        
    }, function onRejected(err) {
     console.log("Erro da função executaFuncoes: ",err)
    });
    
     
        
    }, function onRejected(err) {
     console.log("Erro da função executaFuncoes: ",err)
    });

}
