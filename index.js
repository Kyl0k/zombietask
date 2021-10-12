const mongoose = require("mongoose");

if (process.env.NODE_ENV === "development") {
  const result = require("dotenv").config();
  if (result.error) throw result.error;
}

const connected = () => {
  const app = require("./app");
  app.listen(process.env.PORT, (error) => {
    if (error) {
      console.log(error);
      process.exit(-1);
    }
    console.log(`Zombie app listening at port ${process.env.PORT}`);
  });
};

const connectRejected = (error) => {
  console.log(error);
  process.exit(-1);
};

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(connected, connectRejected);
