import mongoose from "mongoose";
import { database_password, database_uri } from "../../constants/env";
import kleur from "kleur";

const database = database_uri.replace("<db_password>", database_password);
const connectToDatabase = async () => {
  try {
    await mongoose.connect(database);
    console.log(kleur.bgGreen("Successfully connected to database"));
  } catch (error) {
    console.log("Could not connect to database", error);
    process.exit(1);
  }
};

export default connectToDatabase;
