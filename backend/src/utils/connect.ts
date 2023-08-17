import mongoose from "mongoose";
import logger from "./logger";
import "dotenv/config";
import env from "./validatedotenv"

export default async function connect() {
  const DbString = env.MONGO_CONNECTION_STRING;

  try {
    await mongoose.connect(DbString);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("couldnt connect to db");
    process.exit(1);
  }
}
