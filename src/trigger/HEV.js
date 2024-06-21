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
            await HEVRepository.createTriggerHEV("manha",6,0,customers)
            const customersNextDay = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'LABORATORY_EVENT,IMAGE_EVENT'); // Pega exame
            console.log("Criar disparo exame dia seguinte!!!");
            await HEVRepository.createTriggerHEV("manha",6,0,customersNextDay)
            console.log("Criar disparo consulta!!!");
            const customersConsult = await HEVRepository.getClientsWithAppointmentsTomorrow(1,'CONSULT_EVENT'); // Pega consulta
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
}

module.exports = triggerRulesHEV;