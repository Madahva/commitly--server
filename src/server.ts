import { app } from "./app";
import { PORT } from "./config";
import { sequelize } from "./database/connection";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();
