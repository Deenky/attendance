import pool from "./config/database.js";

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected:", connection.threadId);
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();
