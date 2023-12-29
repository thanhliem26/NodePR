'use strict';

const { getSelectData, unGetSelectData } = require('../../utils');

const findAllDiscountUnSelect = async ({
    limit = 10, page = 1, sort = 'ctime',
    filter, unselect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort = 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean()

    return documents;
}

const findAllDiscountSelect = async ({
    limit = 10, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort = 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return documents;
}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean();
}

module.exports = {
    findAllDiscountUnSelect,
    findAllDiscountSelect,
    checkDiscountExists,
}
