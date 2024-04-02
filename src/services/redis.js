const { createClient } = require("redis");
const url_redis = "redis://inbot-vpc.ph02sx.0001.use1.cache.amazonaws.com:6379";

async function enqueueAndPublish(queueName, item) {
    const client = await createClient({ url: url_redis })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    const rpush = await client.rPush(queueName, JSON.stringify(item))

    console.log('Item adicionado à fila:', item);
    console.log(new Date(), `RPUSH: ${JSON.stringify(rpush)}`)
    client.quit();
}


module.exports = {
    enqueueAndPublish,
}