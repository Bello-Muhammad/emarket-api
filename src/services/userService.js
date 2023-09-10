const User = require('../model/user');

const post_SignUp = async (body) => {
    return await User.create(body)
}

const post_Login = async (body) => {
    return await User.findByCredentials(body.email, body.password)

}


module.exports = {
    post_SignUp,
    post_Login,
}