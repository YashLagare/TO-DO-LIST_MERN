import Navbar from '../Components/Navbar';
import TaskCard from './TaskCard';

const Dashboard = ({ tasks, onOpenSidebar, onMoveTaskForward, stages, onDeleteTask, onEditTask }) => {
  const STAGE_NAMES = {
    created: 'Created',
    ongoing: 'Ongoing',
    completed: 'Completed',
    review: 'Review',
    done: 'Done',
  };

  const STAGE_COLORS = {
    created: 'bg-blue-100 border-blue-300',
    ongoing: 'bg-yellow-100 border-yellow-300',
    completed: 'bg-orange-100 border-orange-300',
    review: 'bg-purple-100 border-purple-300',
    done: 'bg-green-100 border-green-300',
  };

  const getNextStage = (currentStage) => {
    const index = stages.indexOf(currentStage);
    return index < stages.length - 1 ? stages[index + 1] : null;
  };

  return (
    <div className="flex-1 flex h-full flex-col">
     
     <Navbar onOpenSidebar={onOpenSidebar} />
      <main className="flex-1 p-2 md:p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stages.map((stage) => {
            const stageTasks = tasks.filter((task) => task.stage === stage);

            return (
              <div
                key={stage}
                className="bg-gray-100 rounded-lg p-3 shadow-sm"
              >
                <h2 className="font-semibold text-center text-gray-800 mb-3">
                  {STAGE_NAMES[stage]}
                  <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">
                    {stageTasks.length}
                  </span>
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stageTasks.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No tasks</p>
                  ) : (
                    stageTasks.map((task) => (
                      <TaskCard
                        key={task.id || task._id}
                        task={task}
                        stageColor={STAGE_COLORS[task.stage]}
                        nextStage={getNextStage(task.stage)}
                        onMoveForward={() => onMoveTaskForward(task.id || task._id)}
                        onDelete={() => onDeleteTask(task.id || task._id)}
                        onEdit={() => onEditTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;