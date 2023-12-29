"use strict";

const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCardById } = require("../models/repository/cart.repo");
const { checkProductByServer } = require("../models/repository/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquiredLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
     * 
        {
            cardId,
            userId, 
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts: [{
                        "shopId",
                        "discountId",
                        "codeId"
                    }],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
     */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cartId is exists
    const foundCard = await findCardById(cartId);

    if(!foundCard) {
        throw new BadRequestError('Cart does not exists')
    }

    const checkout_order = {
        totalPrice: 0, //tong tien hang
        freeShip: 0, // phi van chuyen
        totalDiscount: 0, //tong tien discount giam gia
        totalCheckout: 0, //tong thanh toan
    }

    const shop_order_ids_new = [];

    for(let i = 0; i < shop_order_ids.length; i++) {
        const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

        //check product available
        const checkProductsServer = await checkProductByServer(item_products);
        if(!checkProductsServer[0]) throw new BadRequestError("order wrong!!!");

        const checkoutPrice = checkProductsServer.reduce((acc, product) => {
            return acc + (product.quantity * product.price);
        }, 0)

        //Tong tien truoc khi xu li
        checkout_order.totalPrice =+ checkoutPrice;

        const itemCheckout = {
            shopId,
            shop_discounts,
            priceRaw: checkoutPrice, //tien truoc khi giam gia
            priceApplyDiscount: checkoutPrice,
            item_products: checkProductsServer
        }

        if(shop_discounts.length > 0) {
            const { totalPrice = 0, discount = 0} = await getDiscountAmount({codeId: shop_discounts[i].codeId, userId, shopId, products: checkProductsServer})
            checkout_order.totalDiscount += discount;

            if(discount > 0) {
                itemCheckout.priceApplyDiscount = checkoutPrice - discount;
            }
        }
        //tong thanh toan cuoi cung
        checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
        shop_order_ids_new.push(itemCheckout)
    }

    return {
        shop_order_ids,
        shop_order_ids_new,
        checkout_order
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({cartId, userId, shop_order_ids});

    const products = shop_order_ids_new.flatMap((order)  => order.item_products)
    console.log("🚀 ~ products:", products)

    const acquireProduct = [];
    for(let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i]
        const keyLock = await acquiredLock(productId, quantity, cartId);
        acquireProduct.push(keyLock ? true : false);

        if(keyLock) {
            await releaseLock(keyLock)
        }
    }

    //check if co mot san pham het hang trong kho
    if(acquireProduct.includes(false)) {throw new BadRequestError("Mot so san pham da duoc cap nhat, vui long quay lai gio hang...")};

    const newOrder = orderModel.create({
        order_userId: userId,
        order_checkout: checkout_order,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new
    });

    //truong hop insert thanh cong, thi remove product co trong cart
    if(newOrder) {
        //remove product in cart
    }

    return newOrder;
  }

  /**
   * Query Orders [Users]
   */
  static async getOrdersByUser() {

  }

   /**
   * Query Orders Using Id [Users]
   */
  static async getOneOrderByUser() {

  }

  /**
   * Cancel Orders [Users]
   */
  static async cancelOrderByUser() {

  }

   /**
   * update Orders status [Shop | Admin]
   */
   static async updateOrderStatusByShop() {

   }
}

module.exports = CheckoutService;
