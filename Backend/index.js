import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connectDB.js';
import errorHandler from './middleware/errorHandler.js';
import taskRoutes from './routes/taskRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running!',
    version: '1.0.0',
    endpoints: {
      'GET /api/tasks': 'Get all todos',
      'POST /api/tasks/create': 'Create new todo',
      'PUT /api/tasks/update/:id': 'Update todo',
      'DELETE /api/tasks/delete/:id': 'Delete todo'
    }
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
