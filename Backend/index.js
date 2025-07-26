import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoute.js";
import taskRoutes from "./routes/taskRoutes.js";
// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Health check route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Todo API is running!',
//     version: '1.0.0',
//     endpoints: {
//       'GET /api/tasks': 'Get all todos',
//       'POST /api/tasks/create': 'Create new todo',
//       'PUT /api/tasks/update/:id': 'Update todo',
//       'DELETE /api/tasks/delete/:id': 'Delete todo'
//     }
//   });
// });

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
