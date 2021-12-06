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
    // const {tipoinvestimento ,rentabilidade, prazo} = request.body
    const { fila } = request.body

    const rabbit = new RabbitMqService()
    await rabbit.start();
    rabbit.createQueue(fila);
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

    await browser.close()
    response.send({
        "recomendacoes": pageContent.recomendacoes,
       
    })
})


app.get('/tesouro', async (request, response)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm')

    var pageContent = await page.evaluate( async ()=>{
        
        var nome = document.querySelectorAll('tbody td .td-invest-table__name__text');
        
        var itens = []

        var count = 0;
        
        var aplicacoes = document.querySelectorAll('tbody td .td-invest-table__col__text')
        
        var rent = "";
        var apmin = "";
        for (var index = 0; index < (aplicacoes.length - 1) / 4; index++) {
            
            rent = aplicacoes[count].innerHTML;
            rent = rent.replace(",", ".");
            rent = rent.replace("%", "");

            apmin = aplicacoes[1 + count].innerHTML;
            apmin = apmin.replace("R$ ", "");
            apmin = apmin.replace(",", ".");
            var json = {
                nome : `${nome[index].textContent}`,
                rentabilidade : rent,
                aplicacao_minima : apmin,
                preco : aplicacoes[2 + count].innerHTML,
                prazo : aplicacoes[3 + count].innerHTML,
            }
           
            itens.push(json)
             count += 4
        }
            
            return {
                recomendacoes : itens
            }
        })
        
        await browser.close()
        var rabbit = new RabbitMqService()
        await rabbit.start();
        for await (item of pageContent.recomendacoes){
            //rentabilidade de até 10%
           
            if(parseFloat(item.rentabilidade) <= 10){
                console.log(item)
                if (parseFloat(item.aplicacao_minima) <= 100){
                    await rabbit.publishInQueue('tesouro/10/100', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 500){
                    await rabbit.publishInQueue('tesouro/10/500', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 1000){
                    await rabbit.publishInQueue('tesouro/10/1000', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 5000){
                    await rabbit.publishInQueue('tesouro/10/5000', JSON.stringify(item));
                }
                await rabbit.publishInQueue('tesouro/10/5000+', JSON.stringify(item));
            } //rentabilidade de até 25%
            if(parseFloat(item.rentabilidade) <= 25){
                if (parseFloat(item.aplicacao_minima) <= 100){
                    await rabbit.publishInQueue('tesouro/25/100', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 500){
                    await rabbit.publishInQueue('tesouro/25/500', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 1000){
                    await rabbit.publishInQueue('tesouro/25/1000', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 5000){
                    await rabbit.publishInQueue('tesouro/25/5000', JSON.stringify(item));
                }
                await rabbit.publishInQueue('tesouro/25/5000+', JSON.stringify(item));
            } //rentabilidade de até 50%
            if(parseFloat(item.rentabilidade) <= 50){
                if (parseFloat(item.aplicacao_minima) <= 100){
                    await rabbit.publishInQueue('tesouro/50/100', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 500){
                    await rabbit.publishInQueue('tesouro/50/500', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 1000){
                    await rabbit.publishInQueue('tesouro/50/1000', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 5000){
                    await rabbit.publishInQueue('tesouro/50/5000', JSON.stringify(item));
                }
                await rabbit.publishInQueue('tesouro/50/5000+', JSON.stringify(item));
            } //rentabilidade de até 75%
            if(parseFloat(item.rentabilidade) <= 75){
                if (parseFloat(item.aplicacao_minima) <= 100){
                    await rabbit.publishInQueue('tesouro/75/100', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 500){
                    await rabbit.publishInQueue('tesouro/75/500', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 1000){
                    await rabbit.publishInQueue('tesouro/75/1000', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 5000){
                    await rabbit.publishInQueue('tesouro/75/5000', JSON.stringify(item));
                }
                await rabbit.publishInQueue('tesouro/75/5000+', JSON.stringify(item));
            } //rentabilidade de até 100%
            if(parseFloat(item.rentabilidade) <= 100){
                if (parseFloat(item.aplicacao_minima) <= 100){
                    await rabbit.publishInQueue('tesouro/100/100', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 500){
                    await rabbit.publishInQueue('tesouro/100/500', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 1000){
                    await rabbit.publishInQueue('tesouro/100/1000', JSON.stringify(item));
                }if(parseFloat(item.aplicacao_minima) <= 5000){
                    await rabbit.publishInQueue('tesouro/100/5000', JSON.stringify(item));
                }
                await rabbit.publishInQueue('tesouro/100/5000+', JSON.stringify(item));
            }
            if (parseFloat(item.aplicacao_minima) <= 100){
                await rabbit.publishInQueue('tesouro/100+/100', JSON.stringify(item));
            }if(parseFloat(item.aplicacao_minima) <= 500){
                await rabbit.publishInQueue('tesouro/100+/500', JSON.stringify(item));
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                await rabbit.publishInQueue('tesouro/100+/1000', JSON.stringify(item));
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                await rabbit.publishInQueue('tesouro/100+/5000', JSON.stringify(item));
            }
            await rabbit.publishInQueue('tesouro/100+/5000+', JSON.stringify(item));

            // await rabbit.publishInQueue(`tesouro/${item.rentabilidade}/${item.aplicacao_minima}`, JSON.stringify(item));
        }
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


        var rent = "";
        var apmin = "";
        document.querySelectorAll('table tbody tr ').forEach((e)=>{
           
            
            var td =  e.querySelectorAll('td')

            rent = td[1].lastElementChild.textContent;
            rent = rent.replace(",", ".");
            rent = rent.replace("%", "");
            rent = rent.replace(" a.a", "");
            rent = rent.replace(" CDI", "");

            apmin = td[3].lastElementChild.textContent;
            apmin = apmin.replace("R$ ", "");
            apmin = apmin.replace(",", ".");
           
           
            var json = {
                nome : td[0].lastElementChild.textContent,
                rentabilidade : rent,
                resgate : td[2].lastElementChild.textContent,
                aplicacao_minima : apmin,
                risco : td[4].lastElementChild.textContent,
                fgc : td[5].lastElementChild.textContent
            }
            console.log('--------')
            console.log(json)
            itens.push(json)
        })
     


        return {
            recomendacoes : itens
        }
    })

    await browser.close()
    var rabbit = new RabbitMqService()
    await rabbit.start();
    var resg = ""
    for await (item of pageContent.recomendacoes){
        //rentabilidade de até 10%
        resg = item.resgate;
        resg = resg.replace(" ano", "");
        resg = resg.replace(" anos", "");
        if(parseFloat(item.rentabilidade) <= 10){
            if (parseFloat(item.aplicacao_minima) <= 100){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/10/100/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/10/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/10/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/100/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/10/100/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 500){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/10/500/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/10/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/10/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/500/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/10/500/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/10/1000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/10/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/10/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/1000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/10/1000/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/10/5000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/10/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/10/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/10/5000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/10/5000/5+', JSON.stringify(item));
                }
            }
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/10/5000+/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/10/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/10/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/10/5000+/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/10/5000+/5+', JSON.stringify(item));
            }
        } //rentabilidade de até 25%
        if(parseFloat(item.rentabilidade) <= 25){
            if (parseFloat(item.aplicacao_minima) <= 100){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/25/100/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/25/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/25/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/100/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/25/100/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 500){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/25/500/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/25/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/25/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/500/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/25/500/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/25/1000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/25/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/25/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/1000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/25/1000/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/25/5000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/25/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/25/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/25/5000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/25/5000/5+', JSON.stringify(item));
                }
            }
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/25/5000+/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/25/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/25/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/25/5000+/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/25/5000+/5+', JSON.stringify(item));
            }
        } //rentabilidade de até 50%
        if(parseFloat(item.rentabilidade) <= 50){
            if (parseFloat(item.aplicacao_minima) <= 100){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/50/100/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/50/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/50/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/100/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/50/100/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 500){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/50/500/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/50/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/50/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/500/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/50/500/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/50/1000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/50/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/50/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/1000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/50/1000/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/50/5000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/50/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/50/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/50/5000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/50/5000/5+', JSON.stringify(item));
                }
            }
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/50/5000+/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/50/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/50/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/50/5000+/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/50/5000+/5+', JSON.stringify(item));
            }
        } //rentabilidade de até 75%
        if(parseFloat(item.rentabilidade) <= 75){
            if (parseFloat(item.aplicacao_minima) <= 100){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/75/100/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/75/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/75/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/100/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/75/100/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 500){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/75/500/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/75/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/75/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/500/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/75/500/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/75/1000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/75/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/75/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/1000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/75/1000/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/75/5000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/75/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/75/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/75/5000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/75/5000/5+', JSON.stringify(item));
                }
            }
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/75/5000+/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/75/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/75/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/75/5000+/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/75/5000+/5+', JSON.stringify(item));
            }
        } //rentabilidade de até 100%
        if(parseFloat(item.rentabilidade) <= 100){
            if (parseFloat(item.aplicacao_minima) <= 100){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/100/100/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/100/100/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/100/100/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/100/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/100/100/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 500){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/100/500/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/100/500/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/100/500/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/500/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/100/500/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 1000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/100/1000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/100/1000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/100/1000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/1000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/100/1000/5+', JSON.stringify(item));
                }
            }if(parseFloat(item.aplicacao_minima) <= 5000){
                if(item.resgate.includes("Diário")){
                    await rabbit.publishInQueue('cdb/100/5000/d', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/5+', JSON.stringify(item));
                }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                    await rabbit.publishInQueue('cdb/100/5000/1', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/5+', JSON.stringify(item));
                }else if(parseInt(resg) <= 5){
                    await rabbit.publishInQueue('cdb/100/5000/5', JSON.stringify(item));
                    await rabbit.publishInQueue('cdb/100/5000/5+', JSON.stringify(item));
                }else{
                    await rabbit.publishInQueue('cdb/100/5000/5+', JSON.stringify(item));
                }
            }
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/100/5000+/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/100/5000+/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/100/5000+/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100/5000+/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/100/5000+/5+', JSON.stringify(item));
            }
        }
        if (parseFloat(item.aplicacao_minima) <= 100){
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/100+/100/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/100+/100/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/100+/100/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/100/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/100+/100/5+', JSON.stringify(item));
            }
        }if(parseFloat(item.aplicacao_minima) <= 500){
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/100+/500/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/100+/500/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/100+/500/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/500/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/100+/500/5+', JSON.stringify(item));
            }
        }if(parseFloat(item.aplicacao_minima) <= 1000){
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/100+/1000/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/100+/1000/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/100+/1000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/1000/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/100+/1000/5+', JSON.stringify(item));
            }
        }if(parseFloat(item.aplicacao_minima) <= 5000){
            if(item.resgate.includes("Diário")){
                await rabbit.publishInQueue('cdb/100+/5000/d', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/5+', JSON.stringify(item));
            }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
                await rabbit.publishInQueue('cdb/100+/5000/1', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/5+', JSON.stringify(item));
            }else if(parseInt(resg) <= 5){
                await rabbit.publishInQueue('cdb/100+/5000/5', JSON.stringify(item));
                await rabbit.publishInQueue('cdb/100+/5000/5+', JSON.stringify(item));
            }else{
                await rabbit.publishInQueue('cdb/100+/5000/5+', JSON.stringify(item));
            }
        }
        if(item.resgate.includes("Diário")){
            await rabbit.publishInQueue('cdb/100+/5000+/d', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/1', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/5', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/5+', JSON.stringify(item));
        }else if(item.resgate.includes("meses") || item.resgate.includes("mês") || parseInt(resg) == 1){
            await rabbit.publishInQueue('cdb/100+/5000+/1', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/5', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/5+', JSON.stringify(item));
        }else if(parseInt(resg) <= 5){
            await rabbit.publishInQueue('cdb/100+/5000+/5', JSON.stringify(item));
            await rabbit.publishInQueue('cdb/100+/5000+/5+', JSON.stringify(item));
        }else{
            await rabbit.publishInQueue('cdb/100+/5000+/5+', JSON.stringify(item));
        }

        // await rabbit.publishInQueue(`tesouro/${item.rentabilidade}/${item.aplicacao_minima}`, JSON.stringify(item));
    }
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
        
        var preAt = "";
        var divyel = "";
        for (var index = 0; index < 15; index++) {
            var item = fundos[index];
            var td =  item.querySelectorAll('td')

            preAt = td[2].textContent;
            preAt = preAt.replace(".", "");
            preAt = preAt.replace("R$ ", "");

            divyel = td[5].textContent;
            divyel = divyel.replace(",", ".");
            divyel = divyel.replace("%", "");

            var json = {
                cod_fundo : td[0].textContent,
                setor : td[1].textContent,
                preco_atual : preAt,
                liquidez_diaria :td[3].textContent,
                dividendo : td[4].textContent,
                dividendo_yield : divyel,
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

    await browser.close()
    var rabbit = new RabbitMqService()
    await rabbit.start();
    for await (item of pageContent.recomendacoes){
        if(parseFloat(item.preco_atual) <= 65){
            if (parseFloat(item.dividendo_yield) <= 0.95){
                await rabbit.publishInQueue('fundos/65/0.95', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.05){
                await rabbit.publishInQueue('fundos/65/1.05', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.15){
                await rabbit.publishInQueue('fundos/65/1.15', JSON.stringify(item));
            }
            await rabbit.publishInQueue('fundos/65/1.15+', JSON.stringify(item));
        } //preco_atual de até 25%
        if(parseFloat(item.preco_atual) <= 90){
            if (parseFloat(item.dividendo_yield) <= 0.95){
                await rabbit.publishInQueue('fundos/90/0.95', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.05){
                await rabbit.publishInQueue('fundos/90/1.05', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.15){
                await rabbit.publishInQueue('fundos/90/1.15', JSON.stringify(item));
            }
            await rabbit.publishInQueue('fundos/90/1.15+', JSON.stringify(item));
        } //preco_atual de até 50%
        if(parseFloat(item.preco_atual) <= 125){
            if (parseFloat(item.dividendo_yield) <= 0.95){
                await rabbit.publishInQueue('fundos/125/0.95', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.05){
                await rabbit.publishInQueue('fundos/125/1.05', JSON.stringify(item));
            }if(parseFloat(item.dividendo_yield) <= 1.15){
                await rabbit.publishInQueue('fundos/125/1.15', JSON.stringify(item));
            }
            await rabbit.publishInQueue('fundos/125/1.15+', JSON.stringify(item));
        }
        if (parseFloat(item.dividendo_yield) <= 0.95){
            await rabbit.publishInQueue('fundos/125+/0.95', JSON.stringify(item));
        }if(parseFloat(item.dividendo_yield) <= 1.05){
            await rabbit.publishInQueue('fundos/125+/1.05', JSON.stringify(item));
        }if(parseFloat(item.dividendo_yield) <= 1.15){
            await rabbit.publishInQueue('fundos/125+/1.15', JSON.stringify(item));
        }
        await rabbit.publishInQueue('fundos/125+/1.15+', JSON.stringify(item));
    }

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
