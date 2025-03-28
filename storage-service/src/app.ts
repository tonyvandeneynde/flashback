import express from "express";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes";
import { initializeRabbitMQ } from "./services/rabbitMQService";

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/download", imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initializeRabbitMQ(); // Initialize RabbitMQ service and listen for messages to upload images
});

export default app;
