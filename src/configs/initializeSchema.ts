import { Sequelize } from "sequelize";
import { initializeFAQ } from "../models/faq";
import { initializeUser } from "../models/user";

export default async function initializeSchemas(sequelize: Sequelize) {
  // Initialize models
  const User = initializeUser(sequelize);
  const FAQ = initializeFAQ(sequelize);

  // Sync all the changes to the database
  // Use { force: true } for major changes (drops and recreates tables)
  await sequelize.sync({ alter: true });

  console.log("Schemas have been initialized into SQL!");
}
