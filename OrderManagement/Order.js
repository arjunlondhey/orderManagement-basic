
const Promise = require('bluebird');
const moment = require('moment');
let nativeClient;

/** 
 * createOrder Api - takes orderId and itemList
 * return success if order is created.
 * return status - false if quantity in inventory is less than demand
 */
const createOrder = async (orderId, itemList) => {
    try {
        const collection = nativeClient.db("order").collection('InventoryInfo');
        let itemIdList = [];
        let unavailableItems = [];
        itemList.map(item => {
            itemIdList.push(item.itemId);
        })
        const filter = { "itemId": { $in: [itemIdList] } };
        const records = await collection.find(filter).toArray();
        const unavailableItems = filterItems(records);
        if (!unavailableItems && unavailableItems.length < 1) {
            await insertOrder(orderId, itemList);
            return { status: true, response: {}, responseMessage: "Order created successfully" };
        } else {
            return { status: false, response: unavailableItems, responseMessage: "Some of the items are out of stock" };
        }
    } catch (err) {
        return { status: false, response: { itemList }, responseMessage: err };
    }
}

const filterItems = (items) => {
    const unavailableItems = [];
    for (let i = 0; i < records.length; i++) {
        const { quantity, itemId } = record;
        if (itemList['itemId']['quantity'] > quantity) {
            unavailableItems.push(itemId);
        }
    }
    return unavailableItems;
}
/**
 * 
 * @param {*} orderId 
 * @param {*} itemList 
 * Insert the items in the orderInfo collection
 */
const insertOrder = async (orderId, itemList) => {
    try {
        const collection = nativeClient.db("order").collection('OrderInfo');
        await Promise.map(itemList, async (item) => {
            await collection.updateOne({ orderId }, {
                $set: {
                    itemDetails: item,
                    updatedAt: moment().utc().toDate()
                }
            });
        }, { concurrency: 10 });
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    createOrder
}