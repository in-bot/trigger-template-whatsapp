const axios = require("axios");

function mergeDuplicateNames(arr) {
  const mergedMap = new Map();
  arr.forEach((item) => {
    if(item !== undefined){
      if (mergedMap.has(item.nome)) {
        mergedMap.get(item.nome).id.push(item.id);
      } else {
        mergedMap.set(item.nome, {
          nome: item.nome,
          id: [item.id],
          status: item.status,
        });
      }
    }
  });

  const mergedArray = Array.from(mergedMap.values());

  mergedArray.forEach((item) => {
    if (item.id.length === 1) {
      item.id = item.id[0];
    }
  });
  return mergedArray;
}

const fetchPage = async (page) => {
  const auth_token = "375bbc5a520794ee5690bf65296157547d39e9df";
  const base_url = "https://api.tiny.com.br/api2";
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  
  if (parseInt(dd) - 1 === 0) {
    dd = 32;
  }
  
  const formattedToday = `${dd-1}/${mm}/${yyyy}`;
  const formattedYearAgo = `${dd-1}/${mm}/${yyyy-1}`;
  console.log(formattedToday)
  console.log(formattedYearAgo)
  let responses = [];
  const requestOptions = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${base_url}/contas.receber.pesquisa.php`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      formato: "JSON",
      token: auth_token,
      situacao: "aberto",
      data_fim_vencimento: formattedToday,
      data_ini_vencimento :formattedYearAgo,
      pagina: page
    },
  };
  try {
    const resp = await axios(requestOptions);
    // console.log(resp.data.retorno)
    let totalPagina = resp.data.retorno.numero_paginas;
    console.log(new Date(), `Numero de paginas: ${totalPagina}`)
    for (let i = 0; i < resp.data.retorno?.contas.length; i++) {
      const conta = resp.data.retorno.contas[i].conta;
        responses.push({
          nome: conta.nome_cliente,
          id: conta.id,
          status: conta.situacao,
        });
    }
    return {responses: responses, totalPagina: totalPagina};
  } catch (err) {
    console.log(err);
  }
};

const fetchAllPagesCustomer = async () => {
  let responses = []
  try {
    const fetchPageResponse = await fetchPage(1);
    for (let i = 1; i <= fetchPageResponse.totalPagina; i++) {
      const retorno = await fetchPage(i)
      responses.push(...retorno.responses);
      }
      return mergeDuplicateNames(responses);
  } catch (error) {
    console.error("An error occurred in fetchAllPages function.", error);
  }
};

module.exports = fetchAllPagesCustomer
