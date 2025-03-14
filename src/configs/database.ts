import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  logging: false,
  timezone: "UTC",
  dialectOptions: {
    useUTC: true,
  },
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
