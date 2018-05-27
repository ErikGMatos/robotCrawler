


  const puppeteer = require('puppeteer');

  (async () => {

const browser = await puppeteer.launch();
const page = await browser.newPage();

const cpf = '10493092609';

await page.goto('http://sistemasenem.inep.gov.br/EnemSolicitacao/login.seam');

// Faz login no site
await page.type('#username', 'xxxx'); 
await page.type('#password', 'xxxxx');
await page.click('input[type="image"]');

// Busca pela aba que contem a edicao do enem
const resultsSelector = '#LeftMenu #menugroup_4_3 #row_menugroup_4_3';
await page.waitForSelector(resultsSelector);
await page.click(resultsSelector);

//Escolhe a opção de pesquisa por CPF
const ano = '#j_id50';
await page.click(ano);

//Preenche o input com o CPF a ser pesquisado
const campoDigitarCPF = '#formularioForm';
await page.waitForSelector(campoDigitarCPF);

// Inicia a pesquisa
await page.type('#formularioForm input[type="text"]', cpf); 
await page.click('#formularioForm input[type="image"]');

// Busca a tabela com as informações
const tabelaInscrito = '#inscritoLista';
await page.waitForSelector(tabelaInscrito);

//Seleciona apenas as informacoes principais
const CelulasDaTabela = '#inscritoLista tbody tr td';

// Mineração dos dados a ser exibidos
const informacoes = await page.evaluate(CelulasDaTabela => {
    const celulasTD = Array.from(document.querySelectorAll(CelulasDaTabela));
    return celulasTD.map(x => {
    const title = x.textContent.trim();
    return `DADOS: ${title} - `;
    });
}, CelulasDaTabela);
console.log(informacoes.join('\n'));

// Da um ScreenShot da tela atual
await page.screenshot({path: 'example.png'});
//Encerra conexão
await browser.close();
})();