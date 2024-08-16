const UserService = require("../../services/oec/GetAllCustomers");
const WSGeneral = require("./WSGeneralController");
const WSSurvey = require("./WSSurveyController");

module.exports = {
  getAllUsers: async () => {
    const wsSurvey = new WSSurvey
    const wsGeneral = new WSGeneral
    let users = []
    try {
      users = await UserService.getAllUsers();
      const contactCustomer = await wsGeneral.getDataCustomer(users)
    } catch (error) {
      console.log(error);
      return "Nenhum usuário encontrado";
    }
  },
};
