const redisPubsubService = require('../services/redisPubsub.service');

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }

        console.log("redis test>>>>>>><>>>>>>>>>>>>>>>>>>>>>", order)
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest();
