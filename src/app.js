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
  res.send("Data saved to DB successfully|")
})


  app.listen(7777,()=>{console.log("App listening at 7777")})