import mongoose from "mongoose";
import { DATABASE_URI } from "@/api/database/constants/database.constants";

const connectionOptions: object = {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
};

class ConnectionService {
  constructor () {
    mongoose.connect(DATABASE_URI, connectionOptions)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error: any) => {
        console.log(`Database connection failed : \r\n ${error}`);
      });
  }
}

export default new ConnectionService();
