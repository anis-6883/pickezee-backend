import mongoose from "mongoose";
import { Sequelize } from "sequelize";

export const connectToMongo = async (databaseURL: string) => {
  try {
    await mongoose.connect(databaseURL);
    console.log("Connected to MongoDB Database!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  logging: false,
  timezone: "+00:00",
});

export const connectToPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL Database!");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};
