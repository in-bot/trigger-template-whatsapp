const axios = require("axios")


const allUsers = async () => {
    try {
        const response = await axios.get(`https://api.inbot.com.br/user-manager/v1/customer-parameters/1?initialDate=2024-8-1&finalDate=2024-8-12`)
        return response.data;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    allUsers,
}
