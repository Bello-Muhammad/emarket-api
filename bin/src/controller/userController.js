const {
    post_SignUp,
    post_Login,
} = require('../services/userService');


const getSignUp = (req, res) => {
    const { e } = req.query

    if(e){
        res.render('signup', { e })
    }else{
        res.render('signup')
    }
}

const postSignUp = async (req, res) => {
    try {
        const body = req.body;

        const user = await post_SignUp(body);
        req.session.user = user;
        res.status(200).redirect('/')
    } catch (err) {
        
        res.status(400).redirect('/auth/signup?e='+err.message);
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
    getLogin,
    postLogin,
}