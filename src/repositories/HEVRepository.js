const axios = require("axios").default;
// const confirmacao = require("../mock/confirmacao2.json");
const util = require("../utils/util")

module.exports = {
    async getClientsWithAppointmentsTomorrow(qtyDay,evenType) {
        const date = new Date();
        date.setDate(date.getDate() + qtyDay);
        const formattedDate = date.toISOString().split('T')[0];

        const params = {
            page: 0,
            size: 10000,
            sort: 'scheduleTime,asc',
            timeZone: 'America/Sao_Paulo',
            date: formattedDate,
            types: evenType,
            itemAgendamentoIds: '',
            servicoIds: ''
        };

        const headers = {
            'x-api-key': 'hev#0997ad1680694aeaaa44d6654e3f4607'
        };

        try {

            const response = await axios.get("https://api.globalhealth.mv/prod/event/presence-confirmation/pending", { params, headers });
            const customers = []
            if(response?.data?.content.length > 0){
            // response.data?.content.forEach(customer => { 
            for (const customer of response.data.content) {
                const client = {
                    "botId": "571",
                    "phone": customer.phone,
                    "name": customer.person,
                    "customFields": [
                        { "id": "164ea54dbf04bacaeb327f5368c49873", "value": customer.eventDate },
                        { "id": "8faabc197fea7cf8e7b04e5d8fb8c0b0", "value": customer.eventTime },
                        { "id": "c5a83ce5b026f681d191160e605b357d", "value": customer.itemAgendamentoId },
                        { "id": "4b83a59e8c3bddec461cc08c1d56083d", "value": "" },
                        { "id": "5c9d34e4d0942376b2a52a551678ffed", "value": customer.id },
                        { "id": "d812476cf9628a594c72353babd6a24d", "value": customer.serviceName },
                        { "id": "1c9eceadf8b47b3688687c7aa9e3161d", "value": customer.type },
                        { "id": "7fd4f1674105ce9b120119b66f494953", "value": customer.statusMessage },
                        { "id": "c03f10ddbf4132cd539d728ca3c9334c", "value": customer.professional },
                        { "id": "89133f9b80d96b7a9cc954dcc153bb24", "value": "" }
                    ]
                };
                customers.push(client)
            }
        }
                // });
            return customers;
        } catch (error) {
            console.error(error);
        }
    },
        
    async createCustomerOnTable(client) {
        const headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3RfaWQiOjU3MSwiaWF0IjoxNzE3NDQwMjE2fQ.hfp_mKgnDpioTHUzhDI6Zy59sCi05tO-CWDgdLdVwHE'
        };

        await axios.post("https://api.inbot.com.br/user-manager/v1/customer", client, { headers })
            .then(resp => console.log(resp.data))
            .catch(error => console.log(error));
    },
    
    async createTriggerHEV(periodo, hour, minute, customers) {
        const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
        const date = Math.floor(new Date().getTime() / 1000);
        const horario = new Date();
        horario.setHours(hour, minute, 0);
        
        const data = {
            "campaignName": `confirma_presenca_exame_v1_${date}_${periodo}`,
            "templateName": "template_a_exames",
            "typeTrigger": "agendado",
            "timeTrigger": horario,
            "status": "aguardando",
            "botId": 571,
            "phoneTrigger": '551150804100'
        };
               
        try {
            const resp = await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger', data);
            if(customers.length > 0){
            // customers.forEach(async(element) => {
                for (const element of customers) {
                await util.sleep(2)
                console.log("==============+++++++++++++++++++++++++++++")
                console.log(element)
                const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
                    if((periodo==="manha" && util.timeToMinutes(correctTime) < util.timeToMinutes("13:01")) || (periodo==="tarde" && util.timeToMinutes(correctTime) > util.timeToMinutes("13:00"))){
                        await this.createCustomerOnTable(element);
                        const params = {
                            campaignId: `${resp.data.data.insertId}`,
                            phone: `${element.phone}`,
                            status: "aguardando",
                            payload_1: "CONFIRM_AGENDA_EXAME "+findCustomField(element.customFields,"5c9d34e4d0942376b2a52a551678ffed"),
                            payload_2: "CONFIRM_AGENDA_EXAME_NOSHOW "+findCustomField(element.customFields,"5c9d34e4d0942376b2a52a551678ffed"),
                            variable_1: element.name,
                            variable_2: findCustomField(element.customFields, 'd812476cf9628a594c72353babd6a24d'),
                            variable_3: findCustomField(element.customFields, '164ea54dbf04bacaeb327f5368c49873'),
                            variable_4: findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
                        };

                    await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whats-customer', params);
                    console.log("Solicitação enviada com sucesso!");
                }
            }
        }
            // })
        } catch (error) {
            console.error("Erro ao enviar solicitação:", error);
        }
    },
    async createTriggerHEVConsults(periodo, hour, minute, customers) {
        const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
        const date = Math.floor(new Date().getTime() / 1000);
        const horario = new Date();
        horario.setHours(hour, minute, 0);
        
        const data = {
            "campaignName": `confirma_presenca_consulta_v1_${date}_${periodo}`,
            "templateName": "template_b_consultas",
            "typeTrigger": "agendado",
            "timeTrigger": horario,
            "status": "aguardando",
            "botId": 571,
            "phoneTrigger": '551150804100'
        };
        
        try {
            const resp = await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger', data);
            console.log(customers)
            if(customers.length > 0){
                // customers.forEach(async(element) => {
                for (const element of customers) {
                    await util.sleep(5);
                    console.log("==============+++++++++++++++++++++++++++++")
                    console.log(element)
                    const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
                        if((periodo==="manha" && util.timeToMinutes(correctTime) < util.timeToMinutes("13:01")) || (periodo==="tarde" && util.timeToMinutes(correctTime) > util.timeToMinutes("13:00"))){
                            await this.createCustomerOnTable(element);
                            const params = {
                                campaignId: `${resp.data.data.insertId}`,
                                phone: `${element.phone}`,
                                status: "aguardando",
                                payload_1: "CONFIRM_AGENDA_CONSULTA "+findCustomField(element.customFields,"5c9d34e4d0942376b2a52a551678ffed"),
                                payload_2: "CONFIRM_AGENDA_CONSULTA_NOSHOW "+findCustomField(element.customFields,"5c9d34e4d0942376b2a52a551678ffed"),
                                variable_1: element.name,
                                variable_2: findCustomField(element.customFields, 'd812476cf9628a594c72353babd6a24d'),
                                variable_3: findCustomField(element.customFields, 'c03f10ddbf4132cd539d728ca3c9334c'),
                                variable_4: findCustomField(element.customFields, '164ea54dbf04bacaeb327f5368c49873'),
                                variable_5: findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
                            };

                        await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whats-customer', params);
                        console.log("Solicitação enviada com sucesso!");
                    }
                }
                // })
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação:", error);
        }
    }
};
