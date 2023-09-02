const Admin = require('../model/admin');

const post_AdminSignUp = async (body) => {
    const checkExist = await Admin.findOne({ username: body.username })

    if(checkExist) {
        throw new Error('user exist');
    }
    return await Admin.create(body)
}

const signup_Login = async (body) => {
    return await Admin.findOne({username: body.username});
}

const post_AdminLogin = async (body) => {
    return await Admin.findByCredentials(body.username, body.password)
}

module.exports = {
    post_AdminSignUp,
    signup_Login,
    post_AdminLogin,
}