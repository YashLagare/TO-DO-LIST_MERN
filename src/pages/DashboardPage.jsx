import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Components/Dashboard';
import Sidebar from '../Components/Sidebar';
import {
  clearError,
  createTask,
  deleteTask,
  fetchTasks,
  moveTask,
  updateTask
} from '../store/taskSlice';

const STAGES = ['created', 'ongoing', 'completed', 'review', 'done'];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, hasLoaded } = useSelector((state) => state.tasks);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreateTask = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      setSidebarOpen(false);
      toast.success("Task created successfully 🎉");
    } catch (error) {
      toast.error("Failed to create task ❌");
    }
  };

  const handleMoveTaskForward = async (taskId) => {
    const task = tasks.find((t) => (t.id || t._id) === taskId);
    if (!task) return;

    const currentStageIndex = STAGES.indexOf(task.stage);
    const nextStage = STAGES[currentStageIndex + 1];
    if (!nextStage) return;

    try {
      await dispatch(moveTask({ taskId, stage: nextStage })).unwrap();
      toast.success(`Moved to ${nextStage} ✅`);
    } catch (error) {
      toast.error("Failed to move task ❌");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await dispatch(updateTask({ taskId, taskData: updatedData })).unwrap();
      setSidebarOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully ✨");
    } catch (error) {
      toast.error("Failed to update task ❌");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      toast.success("Task deleted successfully 🚮");
    } catch (error) {
      toast.error("Failed to delete task ❌");
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
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateTask={handleCreateTask}
        onCancel={cancelEdit}
        onUpdateTask={handleUpdateTask}
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
        onMoveTaskForward={handleMoveTaskForward}
        onDeleteTask={handleDeleteTask}
        stages={STAGES}
      />
    </div>
  );
};

export default DashboardPage;