const login=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error);
    }
}

const logout=async(req,res)=>{
    try {
        // res.send("logginng out")
        req.logout();
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

const google=async(req,res)=>{
    try {
        res.send("login with google")
    } catch (error) {
        console.log(error);
    }
}

const redirect=async(req,res)=>{
    try {
        console.log("hello"+ req.isAuthenticated())
        if(req.isAuthenticated()){

            console.log(req.user)
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }
}
const protected=async(req,res)=>{
    try {
        if(req.isAuthenticated()){
            res.send("protected")

        }
        else{
            res.send({msg:"unauthorized"})
        }
        console.log(req.session)
        console.log(req.user)
    } catch (error) {
        console.log(error)
    }
}
module.exports={login,logout,google,redirect,protected}