require("dotenv").config({ path: ".env" });
const redis = require("./services/redis")

const TemplateTriggerRepository = require("./repositories/TemplateTriggerRepository");
const SendTrigger = require("./services/SendTrigger");

async function xptoRoutine() {
    const sendTrigger = new SendTrigger();
    const time = new Date();
    const awaitTrigger = await TemplateTriggerRepository.getByStatus();
    for (let i = 0; i < awaitTrigger.length; i++) {
        if (awaitTrigger[i].time_trigger < time || awaitTrigger[i].type_trigger==="imediato") {
            const customers = await TemplateTriggerRepository.getCustomerByIdTemplate(awaitTrigger[i].id)
            console.log(new Date, `Customers: ${JSON.stringify(customers)}`)
            sendTrigger.send(customers, awaitTrigger[i]);
            TemplateTriggerRepository.updateCampaign(awaitTrigger[i].id);
        }
    }
}

setInterval(xptoRoutine, 60000);
