import { toast } from "react-hot-toast";
const TaskCard = ({ task, stageColor, nextStage, onMoveForward, onDelete, onEdit }) => {
  return (
    <div className={`border-l-4 ${stageColor} bg-gray-100 rounded-lg shadow-sm p-3`}>
      <h3 className="font-bold text-gray-800 text-sm mb-1">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      )}

      {(task.startDate || task.endDate) && (
        <div className="text-xs text-gray-500 mb-2">
          {task.startDate && <div>Start: {task.startDate}</div>}
          {task.endDate && <div>End: {task.endDate}</div>}
        </div>
      )}

      {nextStage && (
        <button
          onClick={() => {
            onMoveForward();
            toast.success(`Moved to ${nextStage} ✅`);
          }}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition"
        >
          Move to {nextStage.charAt(0).toUpperCase() + nextStage.slice(1)}
        </button>
      )}
      <button onClick={ onEdit} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1  rounded">Edit</button>
      <button onClick={() => {
        onDelete();
        toast.success(`Task deleted successfully 🚮`);
      }} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1  rounded">Delete</button>
    </div>
  );
};

export default TaskCard;
