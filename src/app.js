const express = require("express");

const app = express();
app.use(express.json());


app.get("/test", async (req, res) => {

  res.send("API is running...");


});


module.exports = app;



