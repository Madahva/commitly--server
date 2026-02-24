import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import routes from "./routes";
import { CLIENT_ORIGIN_URL, NODE_ENV } from "./config";
import { logger } from "./utils/logger";
import { requestContextMiddleware } from "./middlewares/requestContext.middleware";
import { requestTimeoutMiddleware } from "./middlewares/requestTimeout.middleware";

export const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);

app.use(requestContextMiddleware);

app.use(requestTimeoutMiddleware());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV || "development",
  });
});

app.use("/api", routes);
