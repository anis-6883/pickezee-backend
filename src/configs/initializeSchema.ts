import { Sequelize } from "sequelize";
import { initializeFAQ } from "../models/faq";

export default async function initializeSchemas(sequelize: Sequelize) {
  // Initialize models
  const FAQ = initializeFAQ(sequelize);

  // Sync all the changes to the database
  // Use { force: true } for major changes (drops and recreates tables)
  await sequelize.sync({ alter: true });

  console.log("Schemas have been initialized into SQL!");
}
