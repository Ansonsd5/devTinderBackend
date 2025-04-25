import  express  from "express";

const app = express();

app.use('/user',(req,res,next)=>{
    console.log("user route is called");
    next();
    res.send("Response 1");
},
(req,res)=>{
    console.log("/user second callback function");
    res.send("Response from 2nd function");
}
)



app.listen(7777,()=>{console.log("App listening at 7777")})