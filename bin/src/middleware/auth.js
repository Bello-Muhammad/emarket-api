const isAuth = (req, res, next) => {

    let checkPath = req.path.includes('admin');

    if(req.session.user){
        next();
    }else {
        if (checkPath) {
            res.redirect('/admin/login')
        }else{
            res.redirect('/auth/login')
        }
        
    }
}

const authPage = (permissions) => {
    return (req, res, next) => {
        const role = req.session.user.role;
        if(permissions.includes(role)) {
            next();
        }else{
            res.redirect('/auth/login')
        }
    }
}


module.exports = {
    isAuth,
    authPage
}