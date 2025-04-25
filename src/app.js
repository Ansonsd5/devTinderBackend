import  express  from "express";

const app = express();

app.get('/user', (req, res) => {
    res.send({
        firstName : "Anson",
        lastName : "Dsouza",
    })
  });

app.post('/user',(req, res)=>{
  console.log("Save data to DB");
  res.status(204).send({status : 204,data :"Data saved to DB successfully|"})
})

app.get('/user/:userId/userName/:passkey',(req, res)=>{
console.log(req.params);
res.send("Route ending with a")
})


  app.listen(7777,()=>{console.log("App listening at 7777")})