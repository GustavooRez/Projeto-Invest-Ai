const { response } = require('express');
var bodyParser = require('body-parser')
const express = require('express');
const puppeteer = require('puppeteer');

const RabbitMqService = require('./rabbitmq-server')


const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.post('/criarfila', async (request, response)=>{
    const {tipoinvestimento ,rentabilidade, prazo} = request.body

    const rabbit = new RabbitMqService()
    await rabbit.start();
    rabbit.createQueue(`${tipoinvestimento}/${rentabilidade}/${prazo}`)
    console.log('passou aqui')
    response.send('criou')
})

app.post('/rabbit', async (request, response)=>{
    const rabbit = new RabbitMqService()
    await rabbit.start();
   
    await rabbit.publishInQueue('cdb', JSON.stringify(request.body))

    response.send(request.body)
})

app.get('/', async (request, response)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.necton.com.br/cdb/')
    
    const pageContent = await page.evaluate(()=>{
        var itens = []

        document.querySelectorAll('#produtosRendaFixaTable tbody tr').forEach((e)=>{
            var json = {
                titulo : e.querySelector('.td-product-index span').innerHTML,
                vencimento : e.querySelector('.td-product-due-date .td-content').innerHTML,
                prazo : e.querySelector('.td-product-waiting-date .td-content').innerHTML,
                remuneracao : e.querySelector('.td-product-percentage .td-content').innerHTML,
                aplicacao_minima : e.querySelector('.td-product-minimal-value .td-content').innerHTML
            }

            itens.push(json)
        })


        return {
            recomendacoes : itens
        }
    })

    console.log(pageContent)
    await browser.close()
    response.send({
        "recomendacoes": pageContent.recomendacoes,
       
    })
})


app.get('/tesouro', async (request, response)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm')



    
    var pageContent = await page.evaluate(()=>{

        var nome = document.querySelectorAll('tbody td .td-invest-table__name__text');

        var itens = []

        var count = 0;

        var aplicacoes = document.querySelectorAll('tbody td .td-invest-table__col__text')
        
        for (var index = 0; index < (aplicacoes.length - 1) / 4; index++) {

            var json = {
                nome : `${nome[index].textContent}`,
                rentabilidade : aplicacoes[count].innerHTML,
                aplicacao_minima :aplicacoes[1 + count].innerHTML,
                preco : aplicacoes[2 + count].innerHTML,
                prazo : aplicacoes[3 + count].innerHTML,
            }

            itens.push(json)
            console.log(json)
             count += 4
        }

        return {
            recomendacoes : itens
        }
    })

    console.log(pageContent)
    await browser.close()

    const rabbit = new RabbitMqService()
    await rabbit.start();
   
    await rabbit.publishInQueue('cdb', JSON.stringify({
        "recomendacoes": pageContent.recomendacoes,
       
    }))
   
    response.send({
        "recomendacoes": pageContent.recomendacoes,
       
    })
})


app.get('/cdb', async (request, response)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.c6bank.com.br/investimentos/renda-fixa/?utm_source=google&utm_medium=pi-cpc&utm_campaign=investimentos_teste_investimentos_google&utm_term=as-abcde-18mais_2nd-busca-rendafixa&utm_content=20210702_investimentos_teste_investimentos_google_as-abcde-18mais_search_pi-cpc_2nd-busca-rendafixa_google_renda-fixa_na_lp-c6_bdt-acq&gclid=CjwKCAjwndCKBhAkEiwAgSDKQTFl2sIxObrigERYNyrvb3eQ1eINQChigJ1x-L3vJ61nGStCtd1MHhoCqL0QAvD_BwE&gclid=CjwKCAjwndCKBhAkEiwAgSDKQTFl2sIxObrigERYNyrvb3eQ1eINQChigJ1x-L3vJ61nGStCtd1MHhoCqL0QAvD_BwE')
    
    const pageContent = await page.evaluate(()=>{
        var itens = []

        document.querySelectorAll('table tbody tr ').forEach((e)=>{

            var td =  e.querySelectorAll('td')

            var json = {
                nome : td[0].lastElementChild.textContent,
                rentabilidade : td[1].lastElementChild.textContent,
                resgate : td[2].lastElementChild.textContent,
                aplicacao_minima :td[3].lastElementChild.textContent,
                risco : td[4].lastElementChild.textContent,
                fgc : td[5].lastElementChild.textContent
            }
            itens.push(json)
        })
     


        return {
            recomendacoes : itens
        }
    })

    console.log(pageContent)
    await browser.close()
    response.send({
        "recomendacoes": pageContent.recomendacoes,
       
    })
})


app.get('/fundos', async (request, response)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.fundsexplorer.com.br/ranking',{waitUntil: 'load', timeout: 0})
    
    const pageContent = await page.evaluate(()=>{
        var itens = []

        var fundos = document.querySelectorAll('#table-ranking tbody tr')
        
        
        for (var index = 0; index < 15; index++) {
            var item = fundos[index];
            var td =  item.querySelectorAll('td')

            var json = {
                cod_fundo : td[0].textContent,
                setor : td[1].textContent,
                preco_atual : td[2].textContent,
                liquidez_diaria :td[3].textContent,
                dividendo : td[4].textContent,
                dividendo_yield : td[5].textContent,
                dy_3m_acumulado : td[6].textContent,
                dy_6m_acumulado : td[7].textContent,
                dy_12m_acumulado : td[8].textContent,
                dy_3m_media : td[9].textContent,
                dy_6m_media : td[10].textContent,
                dy_12m_media : td[11].textContent,
                dy_ano : td[12].textContent,
                variacao_preco : td[13].textContent,
                rentab_periodo : td[14].textContent,
                rentab_acumulada : td[15].textContent,
                patrimonio_liquido : td[16].textContent,
                vpq : td[16].textContent,
                p_vpa : td[18].textContent,
                dy_patrimonial : td[19].textContent,
                variacao_patrimonial : td[20].textContent,
                rentabilidade_patrimonial_no_periodo: td[21].textContent
            }
            itens.push(json)

    
        }
        

    
        return {
            recomendacoes : itens
        }
    })

    console.log(pageContent)
    await browser.close()
    response.send({
        "recomendacoes": pageContent.recomendacoes,
       
    })
})

const port = 3000;

app.listen(port, ()=>{
    console.log('server subiu!!!')
})

// ;(async ()=>{
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto('https://www.youtube.com/watch?v=2B6MpQvsQp0')
//     await page.screenshot({path: 'example.png'})

//     await browser.close()
// })()
