import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TimeTracker from "./TimeTracker";
import TaskDetailsPopup from "./Taskpop";

const TaskList = ({ role }) => {
  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // Track which task is being edited
  const [editingTask, setEditingTask] = useState(null);
  
  // Track task time data
  const [taskTimes, setTaskTimes] = useState({});
  
  // Track selected task for popup
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter and sort states
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    searchQuery: ""
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending"
  });

  // Filtered and sorted tasks
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Apply filters and sorting whenever tasks or filter/sort config changes
  useEffect(() => {
    let result = [...tasks];
    
    // Apply filters
    if (filters.status !== "all") {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.priority !== "all") {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    if (filters.type !== "all") {
      result = result.filter(task => task.type === filters.type);
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        (task.assignee && task.assignee.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle null/undefined values
        if (!a[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (!b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        
        // For strings, use localeCompare for proper string comparison
        if (typeof a[sortConfig.key] === "string") {
          return sortConfig.direction === "ascending" 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
        
        // For numbers and other types
        return sortConfig.direction === "ascending" 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      });
    }
    
    setFilteredTasks(result);
  }, [tasks, filters, sortConfig]);

  const handleSaveTask = (task) => {
    if (task.id) {
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    } else {
      // Create a new task with Open status
      const newTask = { ...task, id: Date.now(), status: "Open" };
      setTasks([...tasks, newTask]);
    }
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setSelectedTask(null); // Close popup when opening the edit form
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    localStorage.removeItem(`time-${id}`);
    
    // Close popup if the deleted task was being viewed
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(null);
    }
  };

  const handleApproveTask = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: "Closed" } : task)));
    
    // Update selectedTask if it's the one being approved
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, status: "Closed" });
    }
  };
  
  const handleReopenTask = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: "Open" } : task)));
    
    // Update selectedTask if it's the one being reopened
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, status: "Open" });
    }
  };

  const handleRequestApproval = (taskId) => {
    setTasks(tasks.map(task => (
      task.id === taskId ? { ...task, status: "Pending Approval" } : task
    )));
    
    // Update selectedTask if it's the one being submitted for approval
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: "Pending Approval" });
    }
  };
  
  const handleTimeUpdate = (taskId, time) => {
    setTaskTimes(prev => ({
      ...prev,
      [taskId]: time
    }));
  };
  
  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };
  
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (key) => {
    // If clicking the same column, toggle direction
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "ascending" ? "descending" : "ascending"
      });
    } else {
      // New column, default to ascending
      setSortConfig({
        key,
        direction: "ascending"
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      type: "all",
      searchQuery: ""
    });
  };

  return (
    <div className="task-list-container my-6">
      {role === "Developer" && !editingTask && (
        <button 
          onClick={() => setEditingTask({})} 
          className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600 transition duration-200"
        >
          New Task
        </button>
      )}
      
      {editingTask && (
        <div className="mb-4">
          <TaskForm 
            onSave={handleSaveTask} 
            taskToEdit={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}
      
      {/* Filter and Sort Controls */}
      <div className="mb-6 bg-gray-800 p-4 rounded border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl font-bold mb-2 md:mb-0">Task List</h3>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            {/* Search Input */}
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 w-full md:w-64"
            />
            
            <button 
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded transition duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Testing">Testing</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Priority</label>
            <select 
              name="priority" 
              value={filters.priority} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Type</label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
            >
              <option value="all">All Types</option>
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Improvement">Improvement</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Sort By</label>
            <div className="flex space-x-2">
              <select 
                value={sortConfig.key}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
              >
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="dueDate">Due Date</option>
                <option value="type">Type</option>
              </select>
              
              <button 
                onClick={() => setSortConfig(prev => ({
                  ...prev,
                  direction: prev.direction === "ascending" ? "descending" : "ascending"
                }))}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded transition duration-200"
              >
                {sortConfig.direction === "ascending" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Count Display */}
      <div className="text-sm text-gray-400 mb-4">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>
      
      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className="bg-gray-800 p-4 rounded shadow border border-gray-700 hover:border-blue-500 cursor-pointer transition-all duration-200"
            onClick={() => openTaskDetails(task)}
          >
            <div className={`text-sm font-semibold mb-1 px-2 py-1 rounded inline-block
              ${task.status === "Open" ? "bg-blue-900 text-blue-200" : 
                task.status === "Pending Approval" ? "bg-yellow-900 text-yellow-200" : 
                "bg-green-900 text-green-200"}`
            }>
              {task.status}
            </div>
            
            {task.type && (
              <div className="text-xs font-medium ml-2 px-2 py-1 rounded inline-block bg-gray-700 text-gray-300">
                {task.type}
              </div>
            )}
            
            <h4 className="text-lg font-bold text-white mt-2">{task.title}</h4>
            <p className="text-gray-300 mb-2 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center mb-2">
              <span className={`inline-block w-3 h-3 rounded-full mr-2
                ${task.priority === "High" || task.priority === "Critical" ? "bg-red-500" : 
                  task.priority === "Medium" ? "bg-yellow-500" : 
                  "bg-green-500"}`
              }></span>
              <span className="text-sm text-gray-300">{task.priority} Priority</span>
            </div>
            
            {task.dueDate && (
              <div className="text-sm text-gray-400 mb-2">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            
            {task.assignee && (
              <div className="text-sm text-gray-400 mb-2">
                Assigned to: {task.assignee}
              </div>
            )}

            <TimeTracker task={task} onTimeUpdate={handleTimeUpdate} />
            
            <div className="mt-4 space-x-2 flex flex-wrap" onClick={(e) => e.stopPropagation()}>
              {role === "Developer" && task.status === "Open" && (
                <>
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                  >
                    Delete
                  </button>
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-sm rounded mt-2 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestApproval(task.id);
                    }}
                  >
                    Request Approval
                  </button>
                </>
              )}

              {role === "Manager" && task.status === "Pending Approval" && (
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveTask(task.id);
                  }}
                >
                  Approve
                </button>
              )}
              
              {role === "Manager" && task.status === "Closed" && (
                <button 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-sm rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReopenTask(task.id);
                  }}
                >
                  Reopen Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="bg-gray-800 p-4 rounded text-center border border-gray-700 text-gray-300">
          {tasks.length === 0 ? 
            "No tasks found. Create a new task to get started." :
            "No tasks match your current filters."
          }
        </div>
      )}
      
      {/* Task Details Popup */}
      {selectedTask && (
        <TaskDetailsPopup 
          task={selectedTask} 
          onClose={closeTaskDetails} 
          onEdit={handleEditTask}
          role={role}
        />
      )}
    </div>
  );
};

export default TaskList;