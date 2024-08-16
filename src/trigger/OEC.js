const axios = require("axios");

module.exports = {
  async sendSatisfaction(message,recipientId,sessionId,userTo) {
    console.log(userTo)
    await axios
        // .post("https://teams.inbot.com.br/v1/oec-olivia-staging/api/inchat", {
        .post("https://teams.inbot.com.br/v1/oec-olivia-production/api/inchat", {
          from: userTo,//"29:1D7-rIgHYtRPZ8tHppPeyJ16T7ukyj5TsLmziUh1RCLW841eaZUKhf2NTGKwqu7vf-m-ckD3FiZ7uuUx3x3I8wg",
          to: recipientId,//"28:162c7f75-1aa8-49a3-a1bd-3caddaebd1be",// 
          message: message,// message: "<a target=\"_blank\" href=\"https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6\"> Clique aqui </a> para verificar o Mapa de Casos Globais. </a>\n[quick_replies]\n   {\n      \"title\" : \"Transmissão\",\n      \"content_type\" : \"text\",\n      \"payload\" : \"CORONA_TRANSMISSAO\"\n   },\n   {\n      \"payload\" : \"CORONA_SINTOMAS\",\n      \"content_type\" : \"text\",\n      \"title\" : \"Sintomas\"\n   },\n   {\n      \"payload\" : \"CORONA_PREVENCAO\",\n      \"content_type\" : \"text\",\n      \"title\" : \"Prevenção\"\n   },\n   {\n      \"content_type\" : \"text\",\n      \"payload\" : \"CORONA_DIAGOSTICO\",\n      \"title\" : \"Diagnóstico\"\n   },\n   {\n      \"payload\" : \"CORONA* * TRATAMENTO\",\n      \"content_type\" : \"text\",\n      \"title\" : \"Tratamento\"\n   },\n   {\n      \"content_type\" : \"text\",\n      \"payload\" : \"Vacinas covid\",\n      \"title\" : \"Vacinas\"\n   }\n\n[/quick_replies]",
          escalation: false,
          sessionId: sessionId,//"2422d8c91195fb679a2c88b2927d2896",
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error.response.data));
    }
};
