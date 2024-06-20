const util = require("../utils/util")
const mock = require("../mock/aramis.json")
const axios = require("axios")

async function triggerRulesAramisTestes() {

    const timeString = util.timeString();
    const timeIn24HourFormat = util.convertTo24Hour(timeString);

    let comparisonTime = "08:14"; //HORARIO CORRETO
    if (util.timeToMinutes(timeIn24HourFormat) === util.timeToMinutes(comparisonTime)) {
        comparisonTime = "08:00"; //HORARIO CORRETO
            createTriggerAramis(5,0, "customers", "01", "ONB_1_OPTOUT", util.sumQtyDay(0));
            createTriggerAramis(5,0, "customers", "02", "ONB_2_MENS_CEO", util.sumQtyDay(1));
            createTriggerAramis(5,0, "customers", "03", "ONB_3_EXP_LOJA", util.sumQtyDay(2));
            createTriggerAramis(5,0, "customers", "04", "ONB_4_PONTO", util.sumQtyDay(3));
            createTriggerAramis(5,0, "customers", "05", "ONB_5_PERFORM", util.sumQtyDay(4));
            createTriggerAramis(5,0, "customers", "06", "ONB_6_PILAR1", util.sumQtyDay(5));
            createTriggerAramis(5,0, "customers", "07", "ONB_7_HISTORIA", util.sumQtyDay(6));
            createTriggerAramis(5,0, "customers", "08", "ONB_8_ARAMIS", util.sumQtyDay(7));
            createTriggerAramis(5,0, "customers", "09", "ONB_9_LINHAS", util.sumQtyDay(8));
            createTriggerAramis(5,0, "customers", "010", "ONB_10_LIDERANCA", util.sumQtyDay(9));
            createTriggerAramis(5,0, "customers", "11", "MENU_SUSTENTABILIDADE_BOTOES", util.sumQtyDay(10));
            createTriggerAramis(14,0, "customers", "formulario", "ONB_AV_INST_P1", util.sumQtyDay(1));
            createTriggerAramis(14,0, "customers", "formulario", "ONB_AV_INST_P1", util.sumQtyDay(2));
    }
}

async function createTriggerAramis(hour, minute, customers, step, payload) {
    // const findCustomField = (fields, id) => fields.find(field => field.id === id)?.value || '';
    const date = Math.floor(new Date().getTime() / 1000);
    const horario = new Date();
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
        
        mock.forEach(async(element) => {
        // for (const element of customers) {
            await util.sleep(5);
            console.log("==============+++++++++++++++++++++++++++++")
            console.log(element)
            // const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
            const params = {
                campaignId: `${resp.data.data.insertId}`,
                phone: `${element.telefone}`,
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
