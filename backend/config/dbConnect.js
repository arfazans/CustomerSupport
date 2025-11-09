const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log("DataBase Connect");
  } catch (error) {
    console.log(`error is MongoDB ${error}`);
  }
};

module.exports = {ConnectDB}