import { useEffect, useState } from 'react';
import Dashboard from './Components/Dashboard';
import Sidebar from './Components/Sidebar';
import apiService from './services/api';

const App = () => {
  const STAGES = ['created', 'ongoing', 'completed', 'review', 'done'];

  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiService.getTasks();
        setTasks(data);
        setHasLoaded(true);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, []);



  const createTask = async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error in createTask:', error);
    }
  }

  const moveTaskForward = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId); // Ensure using Mongo _id
    if (!task) return;

    const currentStageIndex = STAGES.indexOf(task.stage);
    const nextStage = STAGES[currentStageIndex + 1];
    if (!nextStage) return;

    try {
      const updated = await apiService.updateTask(taskId, { stage: nextStage });
      setTasks(prev =>
        prev.map(t => (t._id === updated._id ? updated : t))
      );
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const updated = await apiService.updateTask(taskId, updatedData);
      setTasks(prev =>
        prev.map(t => (t._id === updated._id ? updated : t))
      );
      setSidebarOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const onEditTask = (task) => {
    setEditingTask(task);
    setSidebarOpen(true);
  };

  const openSidebar = () => {
    setEditingTask(null);
    setSidebarOpen(true);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateTask={createTask}
        onCancel={cancelEdit}
        onUpdateTask={updateTask}
        editingTask={editingTask}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Dashboard
        tasks={tasks}
        onEditTask={onEditTask}
        onOpenSidebar={openSidebar}
        onMoveTaskForward={moveTaskForward}
        onDeleteTask={deleteTask}
        stages={STAGES}
      />
    </div>
  );
};

export default App;
