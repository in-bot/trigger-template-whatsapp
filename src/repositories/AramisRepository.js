const axios = require("axios");

module.exports = {
  async getAllClients(id, value) {
    try {

      const url = `https://api.inbot.com.br/user-manager/v1/customer-manager/find-customer/with-params?id=${id}&value=${value}`;

      const response = await axios.get(url);
      return response;
    } catch (error) {
      throw new Error("Erro ao pegar os dados do cliente", { error: error });
    }
  }
};