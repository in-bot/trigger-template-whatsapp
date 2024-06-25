const util = require("../utils/util")
const axios = require("axios");
const organicos = require("../repositories/OrganicosDeFatimaRepository")
const mock = require("../mock/organicos.json")

const createCustomerOnTable = (client) => {
    const headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3RfaWQiOjc1MiwiaWF0IjoxNzE4Njc0NjE0fQ.0Kb-sVvHklRvDaFOtCt0YKgUWP9O0brh9Ha0-QMNf14'
    };

    axios.post("https://api.inbot.com.br/user-manager/v1/customer", client, { headers })
        .then(resp => console.log(resp.data))
        .catch(error => console.log(error.data));
};

async function triggerRulesOrganicosDeFatima() {
    const comparisonTime = "07:40"; //HORARIO CORRETO
    const timeString = util.timeString();
    const timeIn24HourFormat = util.convertTo24Hour(timeString);
    if ((util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) && util.businessWeek()) {

        const clients = [];
        const customers = await organicos.fetchAllPages();
        console.log(customers)
        console.log(customers.length)
        for (const customer of customers) {
        // for (const customer of mock) {
            const cpf = customer.cpf_cnpj.replace(/\D/g, '')
            await util.sleep(5) 
            const client = {
                "botId": "752",
                "phone": customer.fone,
                "name": customer.nome,
                "customFields": [
                    { "id": "5fd0b60d176e7280b45137e59a0a5c47", "value": cpf },
                    { "id": "164a97709ab8b38a924f5e294cacc01b", "value": customer.id },
                    { "id": "e8d2ebd87fc532e758a2219ebe91581f", "value": customer.status },
                    { "id": "8f6b1db53b5f7a8e3262035c24001509", "value": new Date() },
                    { "id": "a8583aa41ecc54f905cf7920b3c42f31", "value": "" },
                    { "id": "a9021f78304e4e7632f8288057783e76", "value": "" },
                    { "id": "c754f12ab4af5b3e73a34c5996ead8cd", "value": "" } 
                ]
            };
            console.log(client)
            clients.push(client);
            await createCustomerOnTable(client)
        }
    createTriggerOrganicos(8, clients)
    }
};

async function createTriggerOrganicos(hour, customers) {

    const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
    const date = Math.floor(new Date().getTime() / 1000);
    const horario = new Date();
    horario.setHours(hour, 0, 0);
    
    const data = {
        "campaignName": `base_cliente_${date}`,
        "templateName": `base_cliente`,
        "typeTrigger": "agendado",
        "timeTrigger": horario,
        "status": "aguardando",
        "botId": 752,
        "phoneTrigger": '5521966056479'
    };
    
    console.log(data);
    
    try {

        const resp = await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger', data);
        for (const element of customers) {
            await util.sleep(5);
            console.log("==============+++++++++++++++++++++++++++++")
            console.log(element)
            const params = {
                campaignId: `${resp.data.data.insertId}`,
                phone: `${element.phone}`,
                status: "aguardando",
                payload_1: "VER_DETALHES " + findCustomField(element.customFields,"5fd0b60d176e7280b45137e59a0a5c47"),
            };

                await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whats-customer', params);
                console.log("Solicitação enviada com sucesso!");
            }
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
}

module.exports = triggerRulesOrganicosDeFatima;
