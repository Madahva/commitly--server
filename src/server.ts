import "reflect-metadata";

import { app } from "./app";
import { PORT } from "./config";
import { sequelize } from "./database/connection";

let server: import("http").Server | undefined;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

const gracefulShutdown = async (signal: string) => {
  console.log(`\n📡 Received ${signal}, shutting down gracefully...`);

  try {
    if (server) {
      server.close(() => {
        console.log("✅ HTTP server closed");
      });
    }

    await sequelize.close();
    console.log("✅ Database connection closed");

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
