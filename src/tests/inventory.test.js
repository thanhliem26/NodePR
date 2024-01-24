const redisPubsubService = require('../services/redisPubsub.service');

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (chanel, message) => {
            console.log("🚀 ~ Received message:", message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest();
