function checkAdmin(req,res,next){
if(!req.user.isAdmin) return res.status(403).send('Only Admin is authhorized');
next();

}


module.exports=checkAdmin;