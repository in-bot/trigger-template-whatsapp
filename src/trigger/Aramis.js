const util = require("../utils/util");
const TemplateTriggerRepository = require("../repositories/TemplateTriggerRepository");
// const mockFunc = require("../mock/aramisFuncionarios.json")
const axios = require("axios");

async function triggerRulesAramisTestes() {
  const timeString = util.timeString();
  const timeIn24HourFormat = util.convertTo24Hour(timeString);

  let data = new Date();

  let comparisonTime = "10:10"; //HORARIO CORRETO
  if (
    util.timeToMinutes(timeIn24HourFormat) ===
      util.timeToMinutes(comparisonTime) &&
    data.getDay() === 6
  ) {
    data.setDate(data.getDate() + 3);
    console.log(util.nextWeekEnd());
    console.log(util.nextWeekStart());
    try {
      const _customer = await axios.get(
        "https://api.inbot.com.br/user-manager/v1/customer-manager/customer-by-week/botId/744",
        {
          params: {
            startDate: util.nextWeekStart(),
            endDate: util.nextWeekEnd(),
            parameter: "3393acec2c25dc21cd0be1a9a96eefd5",
          },
        }
      );
      const customer = _customer.data;
      console.log(customer);
      const customersLojas = filterTypeCompany(customer, "LOJAS");
      const customersCD = filterTypeCompany(customer, "MATRIZ");
      const customersMatriz = filterTypeCompany(customer, "CD");
      createTriggerAramis(
        5,
        0,
        customer,
        "01",
        "ONB_1_OPTOUT",
        2,
        "Boas Vindas"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "2",
        "ONB_2_MENS_CEO",
        3,
        "Mensagem CEO"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "03",
        "ONB_3_EXP_LOJA",
        4,
        "Primeiros Passos"
      );
      createTriggerAramis(5, 0, customer, "04", "ONB_4_PONTO", 5, "Benefícios");
      createTriggerAramis(
        5,
        0,
        customer,
        "05",
        "ONB_5_PERFORM",
        6,
        "Treinamentos"
      );
      createTriggerAramis(5, 0, customer, "06", "ONB_6_PILAR1", 9, "Cultura");
      createTriggerAramis(
        5,
        0,
        customer,
        "07",
        "ONB_7_HISTORIA",
        10,
        "História e Evolução"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "08",
        "ONB_8_ARAMIS",
        11,
        "Aramis vs. Urban"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "09",
        "ONB_9_LINHAS",
        12,
        "Linhas de Roupas"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "010",
        "ONB_10_LIDERANCA",
        13,
        "Estrutura das Áreas"
      );
      createTriggerAramis(
        5,
        0,
        customer,
        "11",
        "MENU_SUSTENTABILIDADE_BOTOES",
        16,
        "Sustentabilidade"
      );
      createTriggerAramis(
        14,
        0,
        customersCD,
        "formulario",
        "ONB_AV_INST_P1",
        3,
        "Avaliação Institucional"
      ); // APENAS MATRIZ OU CD
      createTriggerAramis(
        14,
        0,
        customersMatriz,
        "formulario",
        "ONB_AV_INST_P1",
        3,
        "Avaliação Institucional"
      ); // APENAS MATRIZ OU CD
      createTriggerAramis(
        14,
        0,
        customersLojas,
        "formulario",
        "ONB_AV_INST_P1",
        4,
        "Avaliação Institucional"
      ); // APENAS LOJAS
      createTriggerAramis(
        14,
        0,
        customer,
        "psa",
        "PS_INTRO_DISPARO",
        31,
        "PS_INTRO_DISPARO"
      );
    } catch (error) {
      console.error("Error fetching customer data:", error.message);
      throw error; // Re-throws the error after logging it
    }
  }
}

function filterTypeCompany(customers, type) {
  const dataCustomer = [];
  const findCustomField = (fields, id) =>
    fields.find((field) => field.id === id)?.value || "";
  customers.data.map((element) => {
    const valor = findCustomField(
      element.customFields,
      "dd8c6a4819b484f22fe54cbe80b3c5fc"
    );
    if (valor === type) {
      dataCustomer.push(element);
    }
  });
  return { data: dataCustomer };
}

async function createTriggerAramis(
  hour,
  minute,
  customers,
  step,
  payload,
  triggerDate,
  tagName
) {
  const date = Math.floor(new Date().getTime() / 1000);
  const horario = new Date();
  horario.setDate(horario.getDate() + triggerDate);
  horario.setHours(hour, minute, 0);

  const data = {
    campaignName: `onboarding_${step}_${date}`,
    templateName: `campanha_${step}`,
    typeTrigger: "agendado",
    timeTrigger: horario,
    status: "criando",
    botId: 744,
    phoneTrigger: "551151285447",
    tag: tagName,
  };

  console.log(data);

  try {
    const resp = await axios.post(
      "https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whatsapp/trigger",
      data
    );
    const campaignId = resp.data.data.insertId;
    for (const element of customers.data) {
      await util.sleep(5);
      console.log("==============+++++++++++++++++++++++++++++");
      console.log(element);
      // const correctTime = findCustomField(element.customFields, '8faabc197fea7cf8e7b04e5d8fb8c0b0')
      const params = {
        campaignId: `${resp.data.data.insertId}`,
        phone: `${element.phone}`,
        status: "aguardando",
        payload_1: payload,
      };
      if (step === "01") params.variable_1 = element.name;

      await axios.post(
        "https://webhooks.inbot.com.br/inbot-adm-back/v1/gateway/whats-customer",
        params
      );
      console.log("Solicitação enviada com sucesso!");
    }
    await TemplateTriggerRepository.updateCampaign(campaignId, "aguardando");
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
  }
}

module.exports = triggerRulesAramisTestes;
