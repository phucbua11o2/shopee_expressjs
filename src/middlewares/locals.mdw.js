module.exports=function(app){
app.use(async function(req, res, next) {
    if(req.session.isAuthenticated === null) {
        req.session.isAuthenticated = false;
    }

    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;
    res.locals.lcRole = req.session.authRole;
    next();
})
}