'use strict'

const { Types } = require('mongoose');
const { product, clothing, electrtonic, funiture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { 
    findAllDraftForShop, 
    publishProductByShop, 
    findAllPublishForShop, 
    unPublishProductByShop, 
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repository/product.repo');
const { removeUndefiendObject } = require('../utils');

class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("Invalid Product Type", type);
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

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("Invalid Product Type", type);
        return new productClass(payload).updateProduct(productId);
    }

    //PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    //QUERY

    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }

        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async fillAllProducts({ limit = 50, sort = 'ctime', page = 1, filter ={isPublish: true} }) {
        return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb'] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id,unSelect: ['__v'] })
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
        return await product.create({ ...this, _id: product_id })
    }

    async updateProduct(productId, payload) {
        return await updateProductById({productId, bodyUpdate: payload, model: product})
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

    async updateProduct(productId) {
        let objectParams = removeUndefiendObject(this);
        if(objectParams.product_attributes) {
            //update child
            await updateProductById({productId, bodyUpdate: objectParams.product_attributes, model: clothing})
        }

        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
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