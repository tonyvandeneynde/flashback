import express from "express";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes";
import { initializeRabbitMQ } from "./services/rabbitMQService";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/download", imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initializeRabbitMQ(io); // Initialize RabbitMQ service and listen for messages to upload images
});

export default app;
