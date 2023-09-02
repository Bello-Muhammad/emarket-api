const {
    post_SignUp,
    signup_Login,
    post_Login,
} = require('../services/userService');



const getSignUp = (req, res) => {
    res.render('signup')
}

const postSignUp = async (req, res) => {
    try {
        const body = req.body;

        const data = await post_SignUp(body);
        res.status(200).redirect('/auth/signup-login?email='+data.email)
    } catch (err) {
        res.status(400).redirect('/auth/login');
    }
}

const signup_login = async (req, res) => {

    try {
        const body = req.query;

        const user = await signup_Login(body);
        req.session.user = user;
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
}

const getLogin = (req, res) => {
    let { e } = req.query;
    if(e) {
        res.render('login', {
            e
        })
    }else{
        res.render('login')
    }
}

const postLogin = async (req, res) => {
    try {
        const body = req.body;
        const user = await post_Login(body);

        req.session.user = user;
        res.redirect('/')
    } catch (err) {
        const e = err.message
        res.redirect('/auth/login?e='+e)
    }
}

module.exports = {
    getSignUp,
    postSignUp,
    signup_login,
    getLogin,
    postLogin,
}