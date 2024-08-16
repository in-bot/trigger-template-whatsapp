const db = require("../config/dbWhatsApp");

module.exports = {
    getByStatus: (channel) => {
        console.log(channel)
        return new Promise((accept, reject) => {
            db.query(
                "SELECT * FROM templateTriggering WHERE status = 'aguardando';",
                (error, results) => {
                    if (error) {
                        return reject("Request getByStatus error");
                    }
                    accept(results);
                }
            );
        });
    },
    getCustomerByIdTemplate: (id) => {
        return new Promise((accept, reject) => {
            db.query(
                "SELECT * FROM templateTriggeringCustomer where campaign_id = ?;",[id],
                (error, results) => {
                    if (error) {
                        return reject("Request getCustomerByIdTemplate error");
                    }
                    accept(results);
                }
            );
        });
    },
    updateCampaign: (id) => {
        return new Promise((accept, reject) => {
            db.query(
                "UPDATE templateTriggering set status='enviado' where id = ?;",[id],
                (error, results) => {
                    if (error) {
                        return reject("Request update campaign error");
                    }
                    accept(results);
                }
            );
        });
    }
}