import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';

const App = () => {
  const STAGES = ['created', 'ongoing', 'completed', 'review', 'done'];

  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false); 


  useEffect(() => {
    const saved = localStorage.getItem('kanban-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setHasLoaded(true); 
  }, []);

  
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      stage: 'created',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setSidebarOpen(false);
  };

  const moveTaskForward = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              stage: STAGES[STAGES.indexOf(task.stage) + 1]
            }
          : task
      )
    );
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
        onOpenSidebar={openSidebar}
        onMoveTaskForward={moveTaskForward}
        stages={STAGES}
      />
    </div>
  );
};

export default App;
