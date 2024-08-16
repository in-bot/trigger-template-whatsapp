require("dotenv").config({ path: ".env" });

const TemplateTriggerRepository = require("./repositories/TemplateTriggerRepository");
const SendTrigger = require("./services/SendTrigger");
// const SendTriggerTeams = require("./services/SendTriggerTeams");
const triggerRulesHEV = require("./trigger/HEV");
const triggerRulesOrganicosDeFatima = require("./trigger/OrganicosDeFatima");
const triggerRulesAramis = require("./trigger/Aramis");

async function xptoRoutine() {
    try {
        const sendTrigger = new SendTrigger();
        // const sendTriggerTeams = new SendTriggerTeams();
        const time = new Date();
        const awaitTrigger = await TemplateTriggerRepository.getByStatus("whatsapp");
        for (let i = 0; i < awaitTrigger.length; i++) {
            if (awaitTrigger[i].time_trigger < time || awaitTrigger[i].type_trigger === "imediato") {
                try {
                    const customers = await TemplateTriggerRepository.getCustomerByIdTemplate(awaitTrigger[i].id);
                    console.log(new Date(), `Customers: ${JSON.stringify(customers)}`);
                    await TemplateTriggerRepository.updateCampaign(awaitTrigger[i].id);
                    await sendTrigger.send(customers, awaitTrigger[i]);
                } catch (innerError) {
                    console.error(new Date(), `Error processing trigger ${JSON.stringify(awaitTrigger[i])}:`, innerError);
                }
            }
        }
        // const awaitTriggerTeams = await TemplateTriggerRepository.getByStatus("teams");
        // for (let i = 0; i < awaitTriggerTeams.length; i++) {
        //     if (awaitTriggerTeams[i].time_trigger < time || awaitTriggerTeams[i].type_trigger === "imediato") {
        //         try {
        //             const customers = await TemplateTriggerRepository.getCustomerByIdTemplate(awaitTriggerTeams[i].id);
        //             console.log(new Date(), `Customers: ${JSON.stringify(customers)}`);
        //             await TemplateTriggerRepository.updateCampaign(awaitTriggerTeams[i].id);
        //             await sendTriggerTeams.send(customers, awaitTriggerTeams[i]);
        //         } catch (innerError) {
        //             console.error(new Date(), `Error processing trigger ${JSON.stringify(awaitTriggerTeams[i])}:`, innerError);
        //         }
        //     }
        // }
        await triggerRulesHEV();
        await triggerRulesOrganicosDeFatima();
        await triggerRulesAramis();
    } catch (error) {
        console.error(new Date(), 'Error in xptoRoutine:', error);
    }
}


setInterval(xptoRoutine, 60000);
