import "dotenv/config";
import { createServer } from "http";
import { connectToPostgres, sequelize } from "./configs/database";
import initializeSchemas from "./configs/initializeSchema";
import app from "./configs/server";
const server = createServer(app);

const startServer = async () => {
  try {
    await connectToPostgres();
    await initializeSchemas(sequelize);

    const PORT = process.env.PORT || 8080;
    server.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error: any) {
    console.error("Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();
