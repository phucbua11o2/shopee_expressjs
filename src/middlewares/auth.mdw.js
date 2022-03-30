module.exports=
    function restrict(req, res, next) {
        if(!req.session.isAuthenticated){
            let query = '';
            if (req.originalUrl) {
                query = `?returnUrl=${req.originalUrl}`;
            }
            res.redirect(`/accounts/login${query}`);
            } else next();           
    }
