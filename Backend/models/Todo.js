import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  stage:{
    type:String,
    enum: ['created', 'ongoing', 'completed', 'review', 'done'],
    default: 'created'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  startDate:{
    type:String,
  },
  endDate:{
    type:String,
  },
  completed:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
