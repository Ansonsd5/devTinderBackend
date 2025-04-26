export const adminAuth = (req,res,next)=>{
    console.log("Auth called")
    const key = 'secret';
    if(key !== 'secret'){
        res.status(401).send("Unauthorized request")
    }else{
        next()
    }

};

export const userAuth = (req,res,next)=>{
    console.log("User Auth  called")
    const key = 'secret';
    if(key !== 'secret'){
        res.status(401).send("Unauthorized user request")
    }else{
        next()
    }

};

