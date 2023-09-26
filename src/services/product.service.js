'use strict'

const { Types } = require('mongoose');
const { product, clothing, electrtonic, funiture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser } = require('../models/repository/product.repo');

class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    } 

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError("Invalid Product Type", type);
        return new productClass(payload).createProduct();
        // switch (type) {
        //     case 'Eletronics':
        //         return new Electronics(payload).createProduct()
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct()
        //     default:
        //         throw new BadRequestError('Invalid product type', type)
        // }
    }

    static async findAllDraftForShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isPublish: true }

        return await findAllPublishForShop({query, limit, skip})
    }

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }

    static async searchProduct({keySearch}) {
        return await searchProductByUser({keySearch})
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

        const newProduct = await super.createProduct(newClothing._id)
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

class Funiture extends Product {
    async createProduct() {
        const newFunitures = await funiture.create({ ...this.product_attributes, product_shop: this.product_shop })

        if (!newFunitures) throw new BadRequestError('create new Funiture error')

        const newProduct = super.createProduct(newFunitures._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }
}

//register product type
ProductFactory.registerProductType("Eletronics", Electronics)
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Funitures", Funiture)

module.exports = ProductFactory;