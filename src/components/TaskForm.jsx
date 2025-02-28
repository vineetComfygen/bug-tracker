import { useState, useEffect } from "react";

const TaskForm = ({ onSave, taskToEdit, onCancel }) => {
  // Default task state with expanded fields for bug tracking
  const defaultTask = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    type: "Task", // New field: Task or Bug
    assignee: "",
    reporter: "", // Who reported this task/bug
    project: "",
    team: "",
    dueDate: "",
    estimatedHours: "",
    environment: "", // For bugs: Environment where the bug occurs
    reproducibility: "Always", // For bugs: How consistently can it be reproduced
    severity: "Medium", // For bugs: Impact on system functionality
    attachments: [], // For future implementation
    tags: []
  };

  const [task, setTask] = useState(taskToEdit || defaultTask);
  const [tags, setTags] = useState("");
  
  // Initialize tags string from array if task is being edited
  useEffect(() => {
    if (taskToEdit && taskToEdit.tags && Array.isArray(taskToEdit.tags)) {
      setTags(taskToEdit.tags.join(", "));
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process tags from comma-separated string to array
    const processedTags = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Create final task object with processed data
    const finalTask = {
      ...task,
      tags: processedTags
    };
    
    onSave(finalTask);
  };

  // Generate unique ID for form field IDs
  const formId = Math.random().toString(36).substring(7);

  return (
    <div className="p-4 bg-gray-700 shadow rounded">
      <h3 className="text-lg font-bold mb-4">{task.id ? "Edit Task" : "Create Task"}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-semibold mb-3 text-gray-100">Basic Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor={`title-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Title *</label>
              <input 
                id={`title-${formId}`}
                type="text" 
                name="title" 
                value={task.title} 
                onChange={handleChange}
                placeholder="Enter task or bug title" 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor={`type-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Type *</label>
              <select 
                id={`type-${formId}`}
                name="type" 
                value={task.type} 
                onChange={handleChange} 
                className="w-full border bg-gray-700 border-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor={`status-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Status *</label>
              <select 
                id={`status-${formId}`}
                name="status" 
                value={task.status} 
                onChange={handleChange} 
                className="w-full border bg-gray-700 border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Testing">Testing</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Description - Full width */}
            <div className="md:col-span-2">
              <label htmlFor={`description-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Description *</label>
              <textarea 
                id={`description-${formId}`}
                name="description" 
                value={task.description} 
                onChange={handleChange}
                placeholder="Detailed description of the task or bug" 
                className="w-full border border-gray-300 p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-semibold mb-3 text-gray-100">Assignment Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label htmlFor={`assignee-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Assignee</label>
              <input 
                id={`assignee-${formId}`}
                type="text" 
                name="assignee" 
                value={task.assignee} 
                onChange={handleChange}
                placeholder="Person assigned to this task" 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            {/* Reporter */}
            <div>
              <label htmlFor={`reporter-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Reporter</label>
              <input 
                id={`reporter-${formId}`}
                type="text" 
                name="reporter" 
                value={task.reporter} 
                onChange={handleChange}
                placeholder="Person who reported this" 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            {/* Project */}
            <div>
              <label htmlFor={`project-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Project</label>
              <input 
                id={`project-${formId}`}
                type="text" 
                name="project" 
                value={task.project} 
                onChange={handleChange}
                placeholder="Associated project" 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            {/* Team */}
            <div>
              <label htmlFor={`team-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Team</label>
              <input 
                id={`team-${formId}`}
                type="text" 
                name="team" 
                value={task.team} 
                onChange={handleChange}
                placeholder="Responsible team" 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Priority and Timeline Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-semibold mb-3 text-gray-100">Priority and Timeline</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label htmlFor={`priority-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Priority *</label>
              <select 
                id={`priority-${formId}`}
                name="priority" 
                value={task.priority} 
                onChange={handleChange} 
                className="w-full border bg-gray-700 border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor={`dueDate-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Due Date</label>
              <input 
                id={`dueDate-${formId}`}
                type="date" 
                name="dueDate" 
                value={task.dueDate} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label htmlFor={`estimatedHours-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Est. Hours</label>
              <input 
                id={`estimatedHours-${formId}`}
                type="number" 
                name="estimatedHours" 
                value={task.estimatedHours} 
                onChange={handleChange}
                placeholder="0.0" 
                min="0"
                step="0.5"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Bug-specific Fields - Only shown when type is "Bug" */}
        {task.type === "Bug" && (
          <div className="border-b pb-4">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Bug Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Environment */}
              <div>
                <label htmlFor={`environment-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Environment</label>
                <select 
                  id={`environment-${formId}`}
                  name="environment" 
                  value={task.environment} 
                  onChange={handleChange} 
                  className="w-full border bg-gray-700 border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Environment</option>
                  <option value="Development">Development</option>
                  <option value="Staging">Staging</option>
                  <option value="Production">Production</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>

              {/* Reproducibility */}
              <div>
                <label htmlFor={`reproducibility-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Reproducibility</label>
                <select 
                  id={`reproducibility-${formId}`}
                  name="reproducibility" 
                  value={task.reproducibility} 
                  onChange={handleChange} 
                  className="w-full border bg-gray-700 border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Always">Always</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Rarely">Rarely</option>
                  <option value="Unable">Unable to Reproduce</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label htmlFor={`severity-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Severity</label>
                <select 
                  id={`severity-${formId}`}
                  name="severity" 
                  value={task.severity} 
                  onChange={handleChange} 
                  className="w-full border bg-gray-700 border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Blocker">Blocker</option>
                  <option value="Critical">Critical</option>
                  <option value="Major">Major</option>
                  <option value="Medium">Medium</option>
                  <option value="Minor">Minor</option>
                  <option value="Trivial">Trivial</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-700">Additional Information</h4>
          
          <div className="mb-4">
            <label htmlFor={`tags-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Tags</label>
            <input 
              id={`tags-${formId}`}
              type="text" 
              value={tags} 
              onChange={handleTagsChange}
              placeholder="Add tags separated by commas" 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas (e.g., frontend, api, urgent)</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-2 pt-2">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex-1 transition duration-200"
          >
            {task.id ? "Update Task" : "Create Task"}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;