import { Sequelize } from "sequelize";
import { initializeFAQ } from "../models/faq";
import { initializeSession } from "../models/session";
import { initializeSetting } from "../models/setting";
import { initializeUser } from "../models/user";

export default async function initializeSchemas(sequelize: Sequelize) {
  // Initialize models
  const User = initializeUser(sequelize);
  const FAQ = initializeFAQ(sequelize);
  const Setting = initializeSetting(sequelize);
  const Session = initializeSession(sequelize);

  // Sync all the changes to the database
  // Use { force: true } for major changes (drops and recreates tables)
  await sequelize.sync({ alter: true });

  console.log("Schemas have been initialized into SQL!");
}
