const util = require("../utils/util")
const mock = require("../mock/aramis.json")
const mockFunc = require("../mock/aramisFuncionarios.json")
const axios = require("axios")

async function triggerRulesAramisTestes() {

    const timeString = util.timeString();
    const timeIn24HourFormat = util.convertTo24Hour(timeString);

    let comparisonTime = "16:45"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        comparisonTime = "08:00"; //HORARIO CORRETO
            // createTriggerAramis(5,0, "customers", "01", "ONB_1_OPTOUT", 0);
            // createTriggerAramis(5,0, "customers", "02", "ONB_2_MENS_CEO", 1);
            // createTriggerAramis(5,0, "customers", "03", "ONB_3_EXP_LOJA", 2);
            // createTriggerAramis(5,0, "customers", "04", "ONB_4_PONTO", 3);
            // createTriggerAramis(5,0, "customers", "05", "ONB_5_PERFORM", 4);
            // createTriggerAramis(5,0, "customers", "06", "ONB_6_PILAR1", 7);
            // createTriggerAramis(5,0, "customers", "07", "ONB_7_HISTORIA", 8);
            // createTriggerAramis(5,0, "customers", "08", "ONB_8_ARAMIS", 9);
            // createTriggerAramis(5,0, "customers", "09", "ONB_9_LINHAS", 10);
            // createTriggerAramis(5,0, "customers", "010", "ONB_10_LIDERANCA", 11);
            // createTriggerAramis(5,0, "customers", "11", "MENU_SUSTENTABILIDADE_BOTOES", 14);
            // createTriggerAramis(14,0, "customers", "formulario", "ONB_AV_INST_P1", 1); // APENAS MATRIZ OU CD
            // createTriggerAramis(14,0, "customers", "formulario", "ONB_AV_INST_P1", 2); // APENAS LOJAS
    }
}

async function createTriggerAramis(hour, minute, customers, step, payload, triggerDate) {
    // const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
    const date = Math.floor(new Date().getTime() / 1000);
    const horario = new Date();
    horario.setDate(horario.getDate() + triggerDate)
    horario.setHours(hour, minute, 0);
    
    const data = {
        "campaignName": `onboarding_${step}_${date}`,
        "templateName": `campanha_${step}`,
        "typeTrigger": "agendado",
        "timeTrigger": horario,
        "status": "aguardando",
        "botId": 744,
        "phoneTrigger": '551151285447'
    };
    
    console.log(data);
    
    try {
 
        const resp = await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger', data);
        
        mockFunc.data.forEach(async(element) => {
        // for (const element of customers) {
            await util.sleep(5);
            console.log("==============+++++++++++++++++++++++++++++")
            console.log(element)
            // const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
            const params = {
                campaignId: `${resp.data.data.insertId}`,
                phone: `${element.phone}`,
                status: "aguardando",
                payload_1: payload
                };
            if(step==="01") params.variable_1 = element.name

                await axios.post('https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whats-customer', params);
                console.log("Solicitação enviada com sucesso!");
            // }
        })
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
}

module.exports = triggerRulesAramisTestes;
