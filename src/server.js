require("dotenv").config({ path: ".env" });

const TemplateTriggerRepository = require("./repositories/TemplateTriggerRepository");
const SendTrigger = require("./services/SendTrigger");
const triggerRulesHEV = require("./trigger/HEV");
const triggerRulesOrganicosDeFatima = require("./trigger/OrganicosDeFatima");
// const triggerRulesAramis = require("./trigger/Aramis");

async function xptoRoutine() {
    const sendTrigger = new SendTrigger();
    const time = new Date();
    const awaitTrigger = await TemplateTriggerRepository.getByStatus();
    for (let i = 0; i < awaitTrigger.length; i++) {
        if (awaitTrigger[i].time_trigger < time || awaitTrigger[i].type_trigger==="imediato") {
            const customers = await TemplateTriggerRepository.getCustomerByIdTemplate(awaitTrigger[i].id)
            console.log(new Date, `Customers: ${JSON.stringify(customers)}`)
            await TemplateTriggerRepository.updateCampaign(awaitTrigger[i].id);
            await sendTrigger.send(customers, awaitTrigger[i]);
        }
    }   
    triggerRulesHEV();
    triggerRulesOrganicosDeFatima();
    // triggerRulesAramis();

}

setInterval(xptoRoutine, 60000);
