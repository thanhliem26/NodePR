'use strict';
const { NotFoundError } = require('../core/error.response');
const Cart = require('../models/cart.model');
const { getProductById } = require('../models/repository/product.repo');
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

        return await Cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateCartQuantity({userId, product}) {
        const { productId, quantity } = product;
        const checkEmptyProduct = await Cart.findOne({cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active'}).lean();

        let query;
        let updateSet;

        if(checkEmptyProduct) {
            query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active'}; 
            updateSet = {

                $inc: {
                    'cart_products.$.quantity': quantity
                },
            };
        } else {
            query = { cart_userId: userId, cart_state: 'active'}; 
            updateSet = {
                $addToSet: {
                    'cart_products': {...product}
                },
            };
        }

        const options = {upsert: true, new: true};

        return await Cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        // check cart ton tai hay khong?
        const { productId } = product;
 
        const userCart = await Cart.findOne({ cart_userId: userId });
        const foundProduct = await getProductById(productId);
        const { product_name, product_price } = foundProduct;
        
        product = {...product, name: product_name, price: product_price };
   
        if(!userCart) {
            return await CartService.createUserCart({userId, product})
        }

        //gio hang ton tai nhung chua co san pham
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product];

            return await userCart.save();
        }
       console.log("check ::::")
        //gio hang ton tai, va co san pham hien tai
        return await CartService.updateCartQuantity({userId, product})
    }

    // update cart

    static async addToCartV2({userId, shop_order_ids}) {
        // check cart ton tai hay khong?
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductById(productId);
        if(!foundProduct) throw new NotFoundError('not found product');

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product do not belong to the shop")
        }

        if(quantity === 0) {
            //deleted
        }

        return await CartService.updateCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}) {
        const query = { cart_userId: userId, cart_state: 'active'};

        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await Cart.updateOne( query, updateSet );

        return deleteCart;
    }

    static async getListUserCart({userId}) {
        return Cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService;
