import "reflect-metadata";

import { app } from "./app";
import { PORT } from "./config";
import { sequelize } from "./database/connection";
import { logger } from "./utils/logger";

let server: import("http").Server | undefined;

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connected successfully.");

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, "❌ Unable to connect to the database:");
  }
})();

const gracefulShutdown = async (signal: string) => {
  logger.info(`\n📡 Received ${signal}, shutting down gracefully...`);

  try {
    if (server) {
      server.close(() => {
        logger.info("✅ HTTP server closed");
      });
    }

    await sequelize.close();
    logger.info("✅ Database connection closed");

    logger.info("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error(error, "❌ Error during shutdown:");
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
