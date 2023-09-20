'use strict'

const { Types } = require('mongoose');
const { product, clothing, electrtonic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Eletronics':
                return new Electronics(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError('Invalid product type', type)
        }
    }
}

class Product {

    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop })

        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newEletronics = await electrtonic.create({ ...this.product_attributes, product_shop: this.product_shop })

        if (!newEletronics) throw new BadRequestError('create new Electronic error')

        const newProduct = super.createProduct(newEletronics._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }
}

module.exports = ProductFactory;