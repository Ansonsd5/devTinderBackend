import  express  from "express";
import { adminAuth, userAuth } from './middlewares/auth.js'; 

const app = express();

// app.use('/route',"RH1",["RH2","RH3"],"RH4") valid 

app.use('/admin',adminAuth);

app.get('/user/login',(req,res)=>{
    console.log("User logged in successfully");
    res.send("User logged in successfully");
})

app.get('/admin/userdata',(req,res)=>{
    console.log("User data retrived form DB and sent");
    res.send("User deatils are recived")
})

app.use('/user',userAuth, (req,res,next)=>{
    console.log("user route is called");
    next();
    // console.log("coming back again")
    // res.status(404).send("Response 1");
},
(req,res)=>{
    console.log("user second callback function");
    res.send("Response from 2nd function");
}
)

app.listen(7777,()=>{console.log("App listening at 7777")})