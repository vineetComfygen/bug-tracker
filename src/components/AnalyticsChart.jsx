import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

const AnalyticsChart = () => {
  const [taskAnalytics, setTaskAnalytics] = useState({
    dailyCompleted: [],
    statusDistribution: [],
    priorityDistribution: []
  });

  useEffect(() => {
    const tasksData = localStorage.getItem("tasks");
    const tasks = tasksData ? JSON.parse(tasksData) : [];

    if (tasks.length > 0) {
      calculateAnalytics(tasks);
    }
  }, []);

  const calculateAnalytics = (tasks) => {
    setTaskAnalytics({
      dailyCompleted: getDailyCompletionData(tasks),
      statusDistribution: getStatusDistribution(tasks),
      priorityDistribution: getPriorityDistribution(tasks)
    });
  };

  const getDailyCompletionData = (tasks) => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getTime(),
        tasks: 0,
        concurrent: 0
      });
    }

    const closedTasks = tasks.filter(task => task.status === "Closed");

    days.forEach((dayData) => {
      const startOfDay = new Date(dayData.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dayData.date);
      endOfDay.setHours(23, 59, 59, 999);

      dayData.tasks = closedTasks.filter(task =>
        task.updatedAt &&
        new Date(task.updatedAt).getTime() >= startOfDay.getTime() &&
        new Date(task.updatedAt).getTime() <= endOfDay.getTime()
      ).length;

      dayData.concurrent = tasks.filter(task => task.status === "Open" || task.status === "Pending Approval").length;
    });

    return days;
  };

  const getStatusDistribution = (tasks) => {
    const statusCounts = { "Open": 0, "Pending Approval": 0, "Closed": 0 };
    tasks.forEach(task => {
      if (task.status in statusCounts) {
        statusCounts[task.status]++;
      }
    });

    return Object.keys(statusCounts).map(status => ({
      name: status, value: statusCounts[status]
    }));
  };

  const getPriorityDistribution = (tasks) => {
    const priorityCounts = { "High": 0, "Medium": 0, "Low": 0 };
    tasks.forEach(task => {
      if (task.priority in priorityCounts) {
        priorityCounts[task.priority]++;
      }
    });

    return Object.keys(priorityCounts).map(priority => ({
      name: priority, value: priorityCounts[priority]
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-4">Task Analytics</h3>

      <div className="grid grid-cols-1 gap-6">
        {/* Daily Completed Tasks Chart */}
        <div>
          <h4 className="text-md font-semibold mb-2">Weekly Task Activity</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={taskAnalytics.dailyCompleted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" name="Completed Tasks" />
              <Line type="monotone" dataKey="concurrent" stroke="#ff7300" name="Active Tasks" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status and Priority Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={taskAnalytics.statusDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value">
                {taskAnalytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#3B82F6", "#F59E0B", "#10B981"][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={taskAnalytics.priorityDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value">
                {taskAnalytics.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#EF4444", "#F59E0B", "#10B981"][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
