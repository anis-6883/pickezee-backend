import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import errorMiddleware from "../middlewares/errorMiddleware";
import verifyApiKeyHeader from "../middlewares/verifyApiKeyHeader";
import adminRoutes from "../routes/admin.routes";
import clientRoutes from "../routes/client.routes";

const app = express();

// Batteries Include
app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Home Route
app.get("/", (req, res) => {
  return res.status(200).json({ status: true, message: "Assalamu Alaikum! Welcome to Pickezee." });
});

// Main Routes
app.use(verifyApiKeyHeader);
app.use("/api/v1", clientRoutes); // mobile & web
app.use("/api/secret-root/admin", adminRoutes); // admin

// 404 Route
app.use((req, res, next) => {
  return res.status(404).send({ status: false, message: "This route does not exist!" });
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
