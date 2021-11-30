var express = require("express");
var router = express.Router();
var perfil_usuario
var perfil;

//Redirecionamento para a página inicial da aplicação
router.get("/", function (req, res, next) {
  res.render("usuario");
});

router.post("/perfilUsuario", function (req, res) {
  perfil_usuario = req.body;
  
  res.render("perfil_investidor", {});
});

router.post("/perfilInvestidor", function (req, res) {
  var resposta = definirPerfilInvestidor(req.body)
  perfil = resposta;
  res.render("preferencias_investidoras", {'perfil':resposta});
});

router.post("/preferenciasInvestidoras", function (req, res) {
  var resposta = req.body;
  
  res.render("result", {'perfil':perfil, 'preferencias':resposta, 'perfil_usuario':perfil_usuario });
});

function definirPerfilInvestidor(data){

  var conservador = 0, agressivo = 0, moderado = 0;

  switch (data.periodo_retorno) {
    case "1ano":
      agressivo += 2;
      break;
    
    case "1_3anos":
      moderado += 2;
      break;

    case "3anos":
      conservador += 2;
      break;
  
    default:
      break;
  }

  switch (data.cobrir_imprevisto) {
    case "sim":
      agressivo += 1;
      break;
    
    case "nao":
      conservador += 1;
      break;

    default:
      break;
  }

  switch (data.media_mensal) {
    case "1000":
      conservador += 2;
      break;
    
    case "1000_5000":
      moderado += 2;
      conservador += 1;
      break;

    case "5000_10000":
      moderado += 2;
      agressivo += 1;
      break;

    case "10000":
      agressivo += 2;
      break;
  
    default:
      break;
  }

  switch (data.frequencia_investimento) {
    case "sempre":
      agressivo += 1;
      break;
    
    case "dveq":
      moderado += 1;
      break;

    case "nunca":
      conservador += 1;
      break;
  
    default:
      break;
  }

  switch (data.qtd_investido_rendafixa) {
    case "nada":
      conservador += 1;
      break;
    
    case "0_10":
      moderado += 1;
      break;

    case "10":
      agressivo += 1;
      break;
  
    default:
      break;
  }

  switch (data.qtd_investido_rendavariavel) {
    case "nada":
      conservador += 1;
      break;
    
    case "0_10":
      moderado += 1;
      break;

    case "10":
      agressivo += 1;
      break;
  
    default:
      break;
  }

  switch (data.qtd_investido_rendavariavel_2anos) {
    case "nada":
      conservador += 1;
      break;
    
    case "0_10":
      moderado += 1;
      break;

    case "10":
      agressivo += 1;
      break;
  
    default:
      break;
  }

  switch (data.risco) {
    case "pouco":
      conservador += 3;
      break;
    
    case "medio":
      moderado += 3;
      break;

    case "muito":
      agressivo += 3;
      break;
  
    default:
      break;
  }

  switch (data.entendimento) {
    case "form":
      moderado += 1;
      break;
    
    case "exp":
      moderado += 1;
      break;

    case "duas":
      agressivo += 2;
      break;

    case "nenhuma":
      conservador += 2;
      break;
  
    default:
      break;
  }

  switch (data.periodo_retorno) {
    case "basico":
      conservador += 2;
      break;
    
    case "interm":
      moderado += 2;
      break;

    case "avanc":
      agressivo += 2;
      break;
  
    default:
      break;
  }

  // console.log("agressivo",agressivo)
  // console.log("moderado",moderado)
  // console.log("conservador",conservador)

  if(agressivo == conservador || (moderado >= agressivo && moderado >= conservador) || (conservador/agressivo <= 1.5 && agressivo/conservador <= 1.5)){
    return "Perfil Moderado"
  }
  else if(agressivo > conservador){
    return "Perfil Agressivo"
  }
  else if(conservador > agressivo){
    return "Perfil Conservador"
  }
}


module.exports = router;
