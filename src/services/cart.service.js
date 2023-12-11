'use strict';
const { cart } = require('../models/cart.model');
/**
    Key features: Cart Service
    - add product to cart [User]
    - reduce product quantity by oen [User]
    - increase product quantity by One [User]
    - get cart [User]
    - delete cart [User]
    - delete cart item [User]
 */

class CartService {
    static async createUserCart({userId, product}) {
        const query = { cart_userId: userId, cart_state: 'active'};
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            },
        };

        const options = {upsert: true, new: true};

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateCartQuantity({userId, product}) {
        const { productId, quantity } = product;

        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active'};
        const updateSet = {
            $inc: {
                'cart_products.productId': quantity
            },
        };

        const options = {upsert: true, new: true};

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        // check cart ton tai hay khong?
        const userCart = await cart.findOne({cart_userId: userId});
        if(!userCart) {

            return await CartService.createUserCart({userId, product})
        }


        //gio hang ton tai nhung chua co san pham
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product];

            return await userCart.save();
        }

        //gio hang ton tai, va co san pham hien tai
        return await CartService.updateCartQuantity({userId, product})
    }
}

module.exports = CartService;
