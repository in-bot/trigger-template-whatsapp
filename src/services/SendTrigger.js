const redis = require("./redis")

class SendTrigger {
    send(dataCustomer, dataCampaign) {
        for (const customer of dataCustomer) {
            console.log(dataCampaign)
            const params = {
                botId: dataCampaign.bot_id,
                templateId: dataCampaign.template_name,
                senderPhone: dataCampaign.phone_trigger,
                dataClient: [
                    {
                        receiverPhone: `${customer.phone}`,
                        variables: []
                    }
                ]
            };
            if (customer.variable_1 !== null) params.dataClient[0].variables.push(customer.variable_1)
            if (customer.variable_2 !== null) params.dataClient[0].variables.push(customer.variable_2)
            if (customer.variable_3 !== null) params.dataClient[0].variables.push(customer.variable_3)
            if (customer.variable_4 !== null) params.dataClient[0].variables.push(customer.variable_4)
            if (customer.variable_5 !== null) params.dataClient[0].variables.push(customer.variable_5)
            if (customer.variable_6 !== null) params.dataClient[0].variables.push(customer.variable_6)
            if (customer.variable_7 !== null) params.dataClient[0].variables.push(customer.variable_7)
            if (customer.variable_8 !== null) params.dataClient[0].variables.push(customer.variable_8)
            if (customer.variable_9 !== null) params.dataClient[0].variables.push(customer.variable_9)
            console.log(new Date(), `Payload: ${JSON.stringify(params)}`)
            redis.enqueueAndPublish("whatsapp", params);
        }
    }
}

module.exports = SendTrigger;