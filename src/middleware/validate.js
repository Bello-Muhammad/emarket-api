const { validationResult } = require("express-validator");
const ResponseHandler = require("../responseHandler/index.responseHandler");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let msg = errors.array().length > 1 ? 'Input validation error.': errors.array()[0].msg;
        return ResponseHandler.Error(res, 400, msg, errors.array())
    }

    next();
}

module.exports = validate;