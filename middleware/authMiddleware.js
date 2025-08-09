//ensure user is authenticated 
exports.ensureAuthenticated = (req, res, next)=>{
    if(req.session.user){
        return next();
    }
    res.redirect("/login");  //only user that is authenticated can be able to access 
}

//ensure user is a manager 
exports.ensureManager = (req, res, next)=>{
    if(req.session.user && req.session.user.role === "brooderManager"){
        return next();
    }
    res.redirect("/");
}    

//ensure user is a sales agent
exports.ensureSalesRep = (req, res, next)=>{
    if(req.session.user && req.session.user.role === "salesRep"){
        return next();
    }
    res.redirect("/");
}    

//ensure user is a customer 
exports.ensureFarmer = (req, res, next)=>{
    if(req.session.user && req.session.user.role === "farmer"){
        return next();
    }
    res.redirect("/");
}    