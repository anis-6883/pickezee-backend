import "dotenv/config";
import { createServer } from "http";
import app from "./configs/server";
const server = createServer(app);

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();
