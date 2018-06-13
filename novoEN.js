const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    let arquivo = '';
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // browser.on('targetcreated', async (target) => {
    //     let s = target.url();
    //     //the test opens an about:blank to start - ignore this
    //     if (s == 'about:blank') {
    //         return;
    //     }
    // });
try {
    
    
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    
    //await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
    // const client = await page.target().createCDPSession();
    // await client.send('Page.setDownloadBehavior', {
        //   behavior: 'allow', downloadPath: './'
        // });
        
        console.log('iniciando conexão');
        
        const cpf = '35168598811';
        
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
        await timeout(2000);
        await page.click('#formularioForm input[type="image"]');
        
        // Busca a tabela com as informações
        const tabelaInscrito = '#resultadoForm';
        await page.waitForSelector(tabelaInscrito);
        await timeout(2000);
        const slavar = "#resultadoForm input[type='image']";
        await page.click(slavar);
        await page.waitForSelector('.infomsg');
        await timeout(2000);
        await page.click("#j_id57");
        debugger;
        await page.waitForSelector("#listaSolicitacaoAtendidas");
        arquivo = await page.evaluateHandle(() => document.querySelector('#listaSolicitacaoAtendidas tbody tr td').textContent.trim());
        const aHandle = await page.evaluateHandle(() => document.querySelector('#listaSolicitacaoAtendidas tbody tr td:nth-last-child(1) a').href);
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: '../../../../../teste'});
        console.log(arquivo._remoteObject.value+'.txt');
        //const reportLink = '#listaSolicitacaoAtendidas tbody tr td:nth-last-child(1) a';
        await page.goto(aHandle._remoteObject.value, {waitUntil: 'networkidle2'});
        //console.log(aHandle._remoteObject.value);
        await timeout(2000);
        //await page.click(reportLink);
        // console.log('lendo tabela');
        
        
        
        
        
                console.log('\n'+'encerrando conexão >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                
               
               
            } catch (error) {
                console.log('o erro foi: '+ error);
                
            }
            await timeout(20000);
            var content;
// First I want to read the file
fs.readFileSync('./teste/'+arquivo._remoteObject.value+'.txt', function read(err, data) {
    if (err) {
        console.log('Erro no FS: ' + err);
    }
    content = data;

    // Invoke the next step here however you like
    console.log(content);   // Put all of the code here (not the best solution)
              // Or put the next step in a function and invoke it
});
            await browser.close();
            })();
