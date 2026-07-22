const adminAuth = (req,res,next)=>{
    console.log('Admin authentication triggered')
    let token = 'xyz';
    if(token!=='xyz'){
        res.status(401).send('Unauthorized User');
    }else{
        next();
    }
}   

const userAuth = (req,res,next)=>{
    console.log('User auth triggered');
    const token = "xyzkjj";
    const AuthenticatedUser = (token === "xyz");
    if(!AuthenticatedUser){
        res.status(401).send("Unauthorised user!");
    }else(
        next()
    )
}

module.exports = {adminAuth, userAuth}