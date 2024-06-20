require("dotenv").config({ path: ".env" });
// const confirmacao = require("./mock/confirmacao2.json");
const util = require("./utils/util")

const TemplateTriggerRepository = require("./repositories/TemplateTriggerRepository");
const SendTrigger = require("./services/SendTrigger");
const HEVRepository = require("./repositories/HEVRepository");
// const triggerRulesOrganicosDeFatima = require("./trigger/OrganicosDeFatima");
// const triggerRulesAramisTestes = require("./trigger/AramisTeste");

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

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const timeIn24HourFormat = util.convertTo24Hour(timeString);
    console.log(new Date(), `timeString: ${timeIn24HourFormat}`);

    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes("8:30")) {
        try {            
            console.log("Proccess started")
            const customers = await HEVRepository.getClientsWithAppointmentsTomorrow(3); // Pega exame
            console.log("Criar disparo exame D+3!!!");
            await HEVRepository.createTriggerHEV("manha",6,0,customers)
            const customersNextDay = await HEVRepository.getClientsWithAppointmentsTomorrow(1); // Pega exame
            console.log("Criar disparo exame dia seguinte!!!");
            await HEVRepository.createTriggerHEV("manha",6,0,customersNextDay)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsConsultsTomorrow(); // Pega consulta
            await HEVRepository.createTriggerHEVConsults("manha",6,10,customersConsult)
        } catch (error) {
            console.log(error)            
        }
    }
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes("13:30")) {
        try {            
            console.log("Proccess started")
            const customers = await HEVRepository.getClientsWithAppointmentsTomorrow(3,'LABORATORY_EVENT,IMAGE_EVENT');
            console.log("Criar disparo exame D+3 dias!!!");
            await HEVRepository.createTriggerHEV("tarde",11,0,customers)
            const customersNextDay = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'LABORATORY_EVENT,IMAGE_EVENT');
            console.log("Criar disparo exame dia seguinte!!!");
            await HEVRepository.createTriggerHEV("tarde",11,0,customersNextDay)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'CONSULT_EVENT');
            await HEVRepository.createTriggerHEVConsults("tarde",11,10,customersConsult)
        } catch (error) {
            console.log(error)            
        }
    }

    // triggerRulesOrganicosDeFatima();
    // triggerRulesAramisTestes();

}

setInterval(xptoRoutine, 60000);
