
    const puppeteer = require('puppeteer');

    (async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
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
    await page.click('#formularioForm input[type="image"]');

    // Busca a tabela com as informações
    const tabelaInscrito = '#inscritoLista';
    await page.waitForSelector(tabelaInscrito);
    console.log('lendo tabela');
    //Seleciona apenas as informacoes principais
    const CelulasDaTabela = '#inscritoLista tbody tr td';
    console.log('\n'+'DADOS DA PESQUISA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+'\n');
    // Mineração dos dados a ser exibidos
    const informacoes = await page.evaluate(CelulasDaTabela => {
        const celulasTD = Array.from(document.querySelectorAll(CelulasDaTabela));
        return celulasTD.map(x => {
        const title = x.textContent.trim();
        return `DADOS: ${title} - `;
        });
    }, CelulasDaTabela);
    console.log(informacoes.join('\n\n'));
    console.log('\n'+'encerrando conexão >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    // Da um ScreenShot da tela atual
    await page.screenshot({path: 'example.png'});
    //Encerra conexão
    await browser.close();
    })();