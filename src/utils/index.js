'use strict'

const { Types } = require('mongoose');

const convertToObjectIdMongoDb = id => Types.ObjectId(id);
const convertNewToObjectIdMongoDb = id => new Types.ObjectId(id);

const _ = require('lodash');

const getInfoData = ({field = [], object = {}}) => {
    return _.pick(object, field)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefiendObject = obj => {
    Object.keys(obj).forEach((key) => {
        if(obj[key] == null) {
            delete obj[key]
        }
    })

    return obj;
}

const updateNestedObjectParser = obj => {
    const final = {};

    Object.keys(obj).forEach((key) => {
        if(typeof obj[key] === "Object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    console.log("final", final)
    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefiendObject,
    updateNestedObjectParser,
    convertToObjectIdMongoDb,
    convertNewToObjectIdMongoDb
}
