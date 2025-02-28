import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import AnalyticsChart from "../components/AnalyticsChart";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    pending: 0,
    productivity: 0
  });

  // Calculate real task statistics
  useEffect(() => {
    // Get tasks from localStorage
    const tasksData = localStorage.getItem("tasks");
    const tasks = tasksData ? JSON.parse(tasksData) : [];
    
    if (tasks.length === 0) {
      setTaskStats({
        completed: 0,
        pending: 0,
        productivity: 0
      });
      return;
    }
    
    // Count tasks by status
    const completedTasks = tasks.filter(task => task.status === "Closed").length;
    const pendingTasks = tasks.filter(task => task.status === "Pending Approval").length;
    const openTasks = tasks.filter(task => task.status === "Open").length;
    
    // Calculate productivity (completed tasks as percentage of total tasks)
    const totalTasks = tasks.length;
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    setTaskStats({
      completed: completedTasks,
      pending: pendingTasks + openTasks,
      productivity: productivity
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header/Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">TaskDash</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-300">
                Welcome, <span className="font-medium text-white">{user?.username}</span>
                {user?.role && <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">{user.role}</span>}
              </div>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-gray-400">
              Here's your real-time task progress and analytics.
            </p>
          </div>

          {/* Task List Section */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Your Tasks</h3>
            <div className="bg-gray-800 rounded-lg">
              <TaskList role={user?.role} />
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Task Analytics</h3>
            <div className="bg-gray-800 rounded-lg">
              <AnalyticsChart />
            </div>
          </div>

          {/* Real-Time Stats Row */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium mb-2 text-gray-300">Tasks Completed</h4>
              <p className="text-3xl font-bold text-green-400">{taskStats.completed}</p>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium mb-2 text-gray-300">Pending Tasks</h4>
              <p className="text-3xl font-bold text-yellow-400">{taskStats.pending}</p>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium mb-2 text-gray-300">Productivity</h4>
              <p className="text-3xl font-bold text-blue-400">{taskStats.productivity}%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;