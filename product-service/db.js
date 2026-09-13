const mongoose = require("mongoose");

// Each microservice owns and connects to its OWN database.
// This keeps services decoupled -- no service reaches into another's data directly.
//
// Retries on failure instead of crashing immediately: in Docker Compose,
// this container can start slightly before Mongo is ready to accept
// connections even with a healthcheck-gated depends_on, so we give it a
// few attempts rather than exiting on the very first failure.
async function connectDB(retries = 10, delayMs = 3000) {
  const uri = process.env.MONGO_URI;
  const label = process.env.SERVICE_NAME || "service";

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[${label}] MongoDB connected: ${mongoose.connection.host}`);
      break;
    } catch (err) {
      console.error(`[${label}] MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) {
        console.error(`[${label}] Giving up after ${retries} attempts.`);
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn(`[${label}] MongoDB disconnected`);
  });

  return mongoose.connection;
}

module.exports = connectDB;
