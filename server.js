import express from "express";
import { APP_PORT, DB_URL } from "./config/index.js";
import userRoutes from "./routes/index.js"
import errorHandler from "./middlewares/errorHandler.js";
const app = express();
import mongoose from "mongoose";

// Database Connection
const connectDB = async () => {
  try {
      await mongoose.connect(DB_URL);
      console.log("MongoDB connected successfully")
  } catch (error) {
      console.error("Connection failed")
  }
};
connectDB();

app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}.`));
