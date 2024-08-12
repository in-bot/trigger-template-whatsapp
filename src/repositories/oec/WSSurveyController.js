const soap = require('soap');
const xml2js = require('xml2js');
const { sendSatisfaction } = require('../../services/oec/OEC');
const util = require('../../utils/util')
const parser = new xml2js.Parser();



const header = {
    'Content-Type': 'application/xml',
    'SOAPAction': 'urn:main#Request',
    'x-api-key': 'pybPmPd5WD1bk25fuNjz93VcNUxWdJGh4y8DMqZ2' //prod
    // 'x-api-key': 'ATWe6P7tVq7SJ9R2spscxaUPLVJmRAA58pY3OU1t' //dev
};

class WSSurvey {
    async getPendingSurvey(email, cdCliente, cdContato,recipientId,sessionId,userTo){
        // const url_dev = 'https://oec.in.bot/upload/1/WSSurvey.wsdl'
        const url_prod = 'https://oec.in.bot/upload/1/WSSurvey-prd-v2.wsdl'
        console.log(cdCliente)
        console.log(cdContato)
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
                }, (err, res) => {
                    if(err){
                        console.log(err)
                    }
                    token = res.result['$value'];
                    const cookies = client.lastResponseHeaders['set-cookie']

                    client.addHttpHeader('Cookie', cookies);
                    client.getPendingSurvey({
                        auth: token,
                        xmlValue:
                            `<wsqualitor>
                                <contents>
                                    <data>
                                        <cdcliente>${cdCliente}</cdcliente>
                                        <cdcontato>${cdContato}</cdcontato>
                                    </data>
                                </contents>
                            </wsqualitor>`

                    }, (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(res)
                            parser.parseString(res.result['$value'], function (err, result) {
                                if(util.isHasOwnProperty(result.wsqualitor.response_data[0], "dataitem")){
                                    let resultado = (result.wsqualitor.response_data[0].dataitem)
                                    let response = `Você tem ${resultado.length} pesquisa(s) em aberto. Segue a(s) mais recente(s)`;
                                    const qtChamados = resultado.length >= 3 ? 3 : resultado.length;
                                    for (let i = 0; i < qtChamados; i++) {
                                        response += `
                                        <br>ID do chamado ➝ ${resultado[i].idchamado[0]}
                                        <br>Data do chamado ➝ ${resultado[i].dtpesquisa[0]}
                                        <br>[Clique aqui para acessar](${resultado[i].idlink[0]})
                                        <br>===============`
                                    }
                                    console.log(new Date(), `Response: ${JSON.stringify(response)} RecipientID: ${recipientId} SessionID: ${sessionId}`)
                                    sendSatisfaction(response,recipientId,sessionId,userTo)
                            }
                        });
                        }
                    })
                })

            }
        })
    }
}

module.exports = WSSurvey