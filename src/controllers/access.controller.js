'use strict'

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');
class AccessController {

    logout = async (req, res, next) => {
        console.log("logOUT")
        new SuccessResponse({
            message: 'logout succes',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Regiserted OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res)
    }
}

module.exports = new AccessController