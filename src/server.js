require("dotenv").config({ path: ".env" });
const redis = require("./services/redis")
const confirmacao = require("./mock/confirmacao2.json");

const TemplateTriggerRepository = require("./repositories/TemplateTriggerRepository");
const SendTrigger = require("./services/SendTrigger");
const HEVRepository = require("./repositories/HEVRepository");

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

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(new Date(), `timeString: ${timeString}`)
    const comparisonTime = "8:30"; //HORARIO CORRETO
    // const comparisonTime = "15:21"; //HORARIO teste
    

    if (timeToMinutes(timeString) === timeToMinutes(comparisonTime)) {
        try {            
            console.log("Proccess started")
            const customers = await HEVRepository.getClientsWithAppointmentsTomorrow();
            console.log("Criar disparo exame!!!");
            // console.log(customers);
            // await HEVRepository.createTriggerHEV("manha",20,customers)
            // await HEVRepository.createTriggerHEV("tarde",21,customers)
            await HEVRepository.createTriggerHEV("manha",6,customers)
            await HEVRepository.createTriggerHEV("tarde",11,customers)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsConsultsTomorrow();
            // console.log(customersConsult);
            // await HEVRepository.createTriggerHEVConsults("manha",20,customers)
            // await HEVRepository.createTriggerHEVConsults("tarde",21,customers)
            await HEVRepository.createTriggerHEVConsults("manha",7,customersConsult)
            await HEVRepository.createTriggerHEVConsults("tarde",12,customersConsult)
        } catch (error) {
            console.log(error)            
        }
    }


}

setInterval(xptoRoutine, 20000);
