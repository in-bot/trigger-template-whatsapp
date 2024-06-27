const axios = require("axios");
const fetchAllPagesCustomer = require("./OrganicosDeFatimaRepository2");

const fetchPage = async (input) => {
  const auth_token = "375bbc5a520794ee5690bf65296157547d39e9df";
  const base_url = "https://api.tiny.com.br/api2";
  let requestOptions = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${base_url}/contatos.pesquisa.php`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      formato: "JSON",
      token: auth_token,
      pesquisa: "",
    },
  };
  requestOptions.data.pesquisa = input?.nome;
   try {
    const resp = await axios(requestOptions);
    if (resp.data.retorno.status === "Erro") {
      return console.log(resp.data.retorno.erros);
    }
    const body = resp?.data?.retorno?.contatos[0]?.contato;
    if (resp?.data?.retorno?.contatos[0].length > 1) {
      return console.log("Cadastro Duplicado");
    }
    input.id_contato = body.id;
    input.fone = body.fone
      .replace("(", "55")
      .replace(")", "")
      .replace(" ", "")
      .replace("-", "");
    input.cpf_cnpj = body.cpf_cnpj;
    console.log(new Date(), requestOptions.data.pesquisa, `Customer: ${input}`);
    return input;
  } catch (err) {
    console.log(err);
  }
};

const fetchAllPages = async () => {
  let arr = [];
  console.log("Waiting 1 minute...");
  await delay(60000);
  const mergedResponses = await fetchAllPagesCustomer();
  console.log(mergedResponses);
  console.log("Waiting 1 minute...");
  await delay(60000);
  for (let i = 0; i < mergedResponses.length; i++) {
    if ((i + 1) % 50 === 0) {
      await delay(60000);
    }

    const arrValues = await fetchPage(mergedResponses[i]);
    if (arrValues !== undefined && arrValues?.fone !== "") {
      arr.push(arrValues);
    }
  }
  return arr;
};

module.exports = {
  fetchAllPages
}

// (async () => {
//   const values = await fetchAllPages();
//   console.log(values);
//   console.log(values.length);
// })();
