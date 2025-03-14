import { Sequelize } from "sequelize";
import FAQ from "../models/faq";
import Session from "../models/session";
import Setting from "../models/setting";
import User from "../models/user";

export default async function initializeSchemas(sequelize: Sequelize) {
  // Initialize models
  User.initialize(sequelize);
  Session.initialize(sequelize);
  Setting.initialize(sequelize);
  FAQ.initialize(sequelize);

  // Define associations
  User.associate();
  Session.associate();

  // Sync all the changes to the database
  // Use { force: true } for major changes (drops and recreates tables)
  // Use { alter: true } for minor changes
  await sequelize.sync({ alter: true });

  console.log("Schemas have been initialized into SQL!");
}
