
const MongoClient = require('mongodb').MongoClient;
const { createOrder } = require('./OrderManagement/Order');

const init = async () => {
    try {
        console.log("App Started");
        const nativeClient = await MongoClient.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true });
        global.mongoClient = {
            nativeClient
        };

        await createOrder();
        nativeClient.close();
        process.exit(0);
    }
    catch (e) {
        process.exit(1)
    }
}

init();