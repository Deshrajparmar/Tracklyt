require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/singup",(req,res)=>{
  res.send("signup route");
});



app.listen(7000, () => {
  console.log("Server is running on port 7000");
});


module.exports = app;