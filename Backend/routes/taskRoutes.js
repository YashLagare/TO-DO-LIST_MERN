import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Home: Get all todos
router.get('/', async (req, res, next) => {
  try {
    const todos = await Todo.find({}).sort({ createdAt: -1 });

    const transformedTodos = todos.map(todo=>({
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description || '',
      stage: todo.stage,
      startDate: todo.startDate || '',
      endDate: todo.endDate || '',
      priority: todo.priority,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString()
    }));

    res.status(200).json({
      success: true,
      count: transformedTodos.length,
      data: transformedTodos
    });
  } catch (error) {
    next(error);
  }
});

// Create
router.post('/create', async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, priority } = req.body;

    const todo = await Todo.create({
      title,
      description: description || '',
      startDate: startDate || '',
      endDate: endDate || '',
      stage: 'created',
      priority: priority || 'medium',
    });

    const transformedTodos = {
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      stage: todo.stage,
      startDate: todo.startDate,
      endDate: todo.endDate,
      priority: todo.priority,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString()
    };

    res.status(201).json({
      success: true,
      data: transformedTodos,
      message: 'Todo created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update
router.put('/update/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    const transformedTodos ={
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      stage: todo.stage,
      startDate: todo.startDate,
      endDate: todo.endDate,
      priority: todo.priority,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString()
    }

    res.status(200).json({
      success: true,
      data: transformedTodos,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    next(error);
  }
});


//Move to next stage
router.put('/move/:id', async (req, res, next) => {
  try {
    const {stage} = req.body;
    if (!stage) {
      return res.status(400).json({
        success: false,
        error: 'Stage is required'
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { stage },
      {new:true, runValidators:true}
    );
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

     const transformedTodo = {
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      stage: todo.stage,
      startDate: todo.startDate,
      endDate: todo.endDate,
      priority: todo.priority,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString()
    };
    res.status(200).json({
      success: true,
      data: transformedTodo,
      message: 'Todo moved successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Delete
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
