import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Sidebar = ({ isOpen, onClose, onCreateTask, onUpdateTask, editingTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        startDate: editingTask.startDate || '',
        endDate: editingTask.endDate || ''
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required ❌');
      return;
    }

    const formatted = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate
    }

    if (editingTask) {
      // Use the correct ID - prioritize 'id' over '_id'
      const taskId = editingTask.id || editingTask._id;
      if (taskId) {
        onUpdateTask(taskId, formatted);
        // toast.success("Task updated successfully ✅");
      } else {
        console.error('No valid ID found for editing task:', editingTask);
        toast.error("Unable to update task. Please try again.❌");
      }
    } else {
      onCreateTask(formatted);
      toast.success("Task created successfully 🎉");
    }
  };

  return (
    <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg p-6 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{editingTask ? "Edit Task" : "Create Task"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="border rounded px-3 py-2 w-full"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows="3"
            className="border rounded px-3 py-2 w-full"
          ></textarea>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;