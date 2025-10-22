import { sequelize } from "../database/connection";
//import { defineAssociations } from "../models/associations";
import "../database/models/user.model";

//defineAssociations();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await sequelize.sync({ force: true });
    console.log("🗄️  Database tables synced.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
