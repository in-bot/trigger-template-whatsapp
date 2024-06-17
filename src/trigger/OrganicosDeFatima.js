const util = require("../utils/util")

async function triggerRulesOrganicosDeFatima() {
    const comparisonTime = "15:12"; //HORARIO CORRETO
    const timeString = util.timeString();
    const timeIn24HourFormat = util.convertTo24Hour(timeString);
    
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        console.log("Disparo")
    }
};

async function createTriggerHEV(periodo, hour, customers, step) {
    const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    const date = Math.floor(new Date().getTime() / 1000);
    const horario = new Date();
    horario.setHours(hour, 0, 0);
    
    const data = {
        "campaignName": `onboarding_${step}_${date}`,
        "templateName": `campanha_+${step}`,
        "typeTrigger": "agendado",
        "timeTrigger": horario,
        "status": "aguardando",
        "botId": 744,
        "phoneTrigger": '551151285447'
    };
    
    console.log(data);
    
    try {
        const sleep = async function (seconds) {
            let ms = seconds * 100;
            await new Promise(resolve => setTimeout(() => resolve(), ms));
        };
        const resp = await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger', data);
        // customers.forEach(async(element) => {
        for (const element of customers) {
            await sleep(5);
            console.log("==============+++++++++++++++++++++++++++++")
            console.log(element)
            const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
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
        // })
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
}

module.exports = triggerRulesOrganicosDeFatima;
