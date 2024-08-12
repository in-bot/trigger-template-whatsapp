const soap = require('soap');
const Promise = require("bluebird");
const xml2js = require('xml2js');
const WSSurvey = require('./WSSurveyController');
const util = require('../../utils/util')
const parser = new xml2js.Parser();

const header = {
    'Content-Type': 'application/xml',
    'SOAPAction': 'urn:main#Request',
    'x-api-key': 'pybPmPd5WD1bk25fuNjz93VcNUxWdJGh4y8DMqZ2' //prod
    // 'x-api-key': 'ATWe6P7tVq7SJ9R2spscxaUPLVJmRAA58pY3OU1t' //dev
};

class WSGeneral {

    async getDataCustomer(users) {
        // const url_dev = 'https://oec.in.bot/upload/1/WSGeneral.wsdl';
        const url_prod = 'https://oec.in.bot/upload/1/WSGeneral-prd-v2.wsdl';
        await soap.createClient(url_prod, { headers: header }, (err, client) => {
            if (err) {
                console.log(err)
            } else {
                let token = '';

                client.addHttpHeader('Content-Type', 'application/xml');
                client.addHttpHeader('SOAPAction', `urn:main#Request`);
                // client.addHttpHeader('x-api-key', `ATWe6P7tVq7SJ9R2spscxaUPLVJmRAA58pY3OU1t`);//dev
                client.addHttpHeader('x-api-key', `pybPmPd5WD1bk25fuNjz93VcNUxWdJGh4y8DMqZ2`);//prod
                client.addHttpHeader('connection', 'keep-alive');

                client.login({
                    login: 'ti_chatbot',
                    passwd: 'ti_chatbot',
                    company: '1'
                }, async (err, res) => {
                    if (err) {
                        return err;
                    }
                    token = res.result['$value'];
                    const cookies = client.lastResponseHeaders['set-cookie']
                    console.log(token)
                    client.addHttpHeader('Cookie', cookies);
                    const wsSurvey = new WSSurvey
                    for (let i = 0; i < users.length; i++) {
                        await Promise.delay(3000);
                        console.log(users[i])
                        let email = users[i].user_id
                        let recipientId = users[i].recipient_id
                        let sessionId = users[i].session_id
                        let userTo = JSON.parse(users[i].teams_reference).user.id;
                        try {
                            client.getCustomerContact({
                                auth: token,
                                xmlValue:
                                    `<wsqualitor>
                            <contents>
                                <data>
                                    <dsemail>${email}</dsemail>
                                </data>
                            </contents>
                        </wsqualitor>`
                            }, (err, res) => {
                                if (err) {
                                    return err;
                                } else {
                                    console.log(`Resultado: ${JSON.stringify(res.result)}`)
                                    if (res.result !== undefined) {
                                        parser.parseString(res.result['$value'], function (err, result) {
                                            let resultado = (result.wsqualitor)
                                            if (util.isHasOwnProperty(resultado.response_data[0], "dataitem")) {
                                                console.log(resultado.response_data)
                                                const dataUser = resultado.response_data[0].dataitem[0];
                                                wsSurvey.getPendingSurvey(email, dataUser.cdcliente[0], dataUser.cdcontato[0], recipientId, sessionId, userTo)
                                                return resultado.response_data[0].dataitem
                                            }
                                        })
                                    };
                                }

                            })
                        } catch (error) {
                            console.log(error)
                        }
                    }
                })

            }
        })
    }
}

module.exports = WSGeneral