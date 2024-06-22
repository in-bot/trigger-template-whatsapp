const util = require("../utils/util")
const HEVRepository = require("../repositories/HEVRepository");

async function triggerRulesHEV() {
    const time = new Date();
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const timeIn24HourFormat = util.convertTo24Hour(timeString);
    console.log(new Date(), `timeString: ${timeIn24HourFormat}`);

    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes("8:30")) {
        try {            
            console.log("Proccess started")
            const customers = await HEVRepository.getClientsWithAppointmentsTomorrow(3,'LABORATORY_EVENT,IMAGE_EVENT'); // Pega exame
            console.log("Criar disparo exame D+3!!!");
            if(customers.length > 0 )
                await HEVRepository.createTriggerHEV("manha",6,0,customers)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'CONSULT_EVENT'); // Pega consulta
            if(customersConsult.length > 0 )
                await HEVRepository.createTriggerHEVConsults("manha",6,5,customersConsult)
        } catch (error) {
            console.log(error)            
        }
    }
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes("13:30")) {
        try {            
            console.log("Proccess started")
            const customers = await HEVRepository.getClientsWithAppointmentsTomorrow(3,'LABORATORY_EVENT,IMAGE_EVENT');
            console.log("Criar disparo exame D+3 dias!!!");
            if(customers.length > 0 )
                await HEVRepository.createTriggerHEV("tarde",11,0,customers)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'CONSULT_EVENT');
            if(customersConsult.length > 0 )
                await HEVRepository.createTriggerHEVConsults("tarde",11,10,customersConsult)
        } catch (error) {
            console.log(error)            
        }
    }
}

module.exports = triggerRulesHEV;