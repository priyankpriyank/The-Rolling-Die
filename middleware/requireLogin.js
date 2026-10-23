function requireLogin(req, res, next) {

    if (!req.session.managerId) {
        return res.redirect("/manager/login");
    }

    next();
}

module.exports = requireLogin;