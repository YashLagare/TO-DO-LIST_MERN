
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import Dashboard from '../Components/Dashboard';
import Sidebar from '../Components/Sidebar';
import apiService from '../services/api';

const STAGES = ['created', 'ongoing', 'completed', 'review', 'done'];

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiService.getTasks();
        setTasks(data);
        setHasLoaded(true);
        setError(null);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please check if the server is running.');
        setHasLoaded(true);
      }
    };
    fetchTasks();
  }, []);

  const createTask = async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setSidebarOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error in createTask:', error);
      setError('Failed to create task');
    }
  };

  const moveTaskForward = async (taskId) => {
    const task = tasks.find((t) => (t.id || t._id) === taskId);
    if (!task) {
      setError('Task not found');
      return;
    }

    const currentStageIndex = STAGES.indexOf(task.stage);
    const nextStage = STAGES[currentStageIndex + 1];
    if (!nextStage) return;

    try {
      const updated = await apiService.updateTask(taskId, { stage: nextStage });
      setTasks((prev) =>
        prev.map((t) => ((t.id || t._id) === (updated.id || updated._id) ? updated : t))
      );
      setError(null);
    } catch (error) {
      console.error('Error moving task:', error);
      setError('Failed to move task');
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const updated = await apiService.updateTask(taskId, updatedData);
      setTasks((prev) =>
        prev.map((t) => ((t.id || t._id) === (updated.id || updated._id) ? updated : t))
      );
      setSidebarOpen(false);
      setEditingTask(null);
      setError(null);
      toast.success("Task updated successfully ✨");
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => (t.id || t._id) !== taskId));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
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

  if (!hasLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

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

export default DashboardPage;
