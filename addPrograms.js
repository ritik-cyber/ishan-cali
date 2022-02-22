require("dotenv").config();
const mongoose = require("mongoose");
const Program = require("./modles/Program");

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connect mongodb");
  })
  .catch(console.error);

const program = {
  name: "final test",
  imageLink: "",
  videoLink: "some link",
  description: "lorem ipsum",
  price: 1200,
  discountPercent: 10,
  content: "some ebook",
};

Program.create(program)
  .then(() => console.log("created"))
  .catch(() => console.log(error));
