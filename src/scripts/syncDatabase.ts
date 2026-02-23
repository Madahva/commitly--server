import { sequelize } from "../database/connection";
import "../database/models";
import { logger } from "../utils/logger";

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connected successfully.");

    await sequelize.sync({ force: true });
    logger.info("🗄️  Database tables synced.");
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
