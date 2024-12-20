const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "675a0aecadc8600e861464f9",
  };
  next();
});

const routes = require("./routes");
app.use(routes);

app.listen(PORT, (req, res) => {
  console.log(`App listening at port ${PORT}`);
});
