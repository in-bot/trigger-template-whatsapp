const redis = require("./redis")

class SendTriggerTeams {
    async send(dataCustomer, dataCampaign) {
        for (const customer of dataCustomer) {
            console.log(dataCampaign)
            const params = {
                botId: dataCampaign.bot_id,
                templateId: dataCampaign.template_name,
                triggerId: dataCampaign.id,
                senderPhone: dataCampaign.phone_trigger,
                payloads: [],
                dataClient: [
                    {
                        receiverPhone: `${customer.phone}`,
                        variables: [],
                        type_header: customer?.type_media,
                        url_header: customer?.media_url,
                    }
                ]
            };
            if (customer.payload_1 !== null) params.payloads.push(customer.payload_1)
            if (customer.payload_2 !== null) params.payloads.push(customer.payload_2)
            if (customer.payload_3 !== null) params.payloads.push(customer.payload_3)
            if (customer.variable_1 !== null) params.dataClient[0].variables.push(customer.variable_1)
            if (customer.variable_2 !== null) params.dataClient[0].variables.push(customer.variable_2)
            if (customer.variable_3 !== null) params.dataClient[0].variables.push(customer.variable_3)
            if (customer.variable_4 !== null) params.dataClient[0].variables.push(customer.variable_4)
            if (customer.variable_5 !== null) params.dataClient[0].variables.push(customer.variable_5)
            if (customer.variable_6 !== null) params.dataClient[0].variables.push(customer.variable_6)
            if (customer.variable_7 !== null) params.dataClient[0].variables.push(customer.variable_7)
            if (customer.variable_8 !== null) params.dataClient[0].variables.push(customer.variable_8)
            if (customer.variable_9 !== null) params.dataClient[0].variables.push(customer.variable_9)
            console.log(" %s payload enviado para o redis: %O", new Date(), params)
            try {
                await redis.enqueueAndPublish("teams", params);
            } catch (error) {
                console.error("Erro ao enfileirar e publicar para o Redis:", error);
            }
        }
    }
}

module.exports = SendTriggerTeams;