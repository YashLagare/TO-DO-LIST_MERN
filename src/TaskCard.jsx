
const TaskCard = ({ task, stageColor, nextStage, onMoveForward }) => {
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
          onClick={onMoveForward}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition"
        >
          Move to {nextStage.charAt(0).toUpperCase() + nextStage.slice(1)}
        </button>
      )}
    </div>
  );
};

export default TaskCard;
