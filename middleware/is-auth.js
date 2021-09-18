module.exports = (req, res, next) => {
    console.log(req.session);
    if(req.session.isAuth){
        next();
    } else {
        req.session.error = "Login First DumbAss !";
        res.status(401).json({message : "Login failed !"});
    }
}