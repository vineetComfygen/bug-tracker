import { useState, useEffect } from "react";

const TaskDetailsPopup = ({ task, onClose, onEdit, onSave, role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [tags, setTags] = useState(task.tags ? task.tags.join(", ") : "");

  useEffect(() => {
    // Update the local state when the task prop changes
    setEditedTask(task);
    setTags(task.tags ? task.tags.join(", ") : "");
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
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
      ...editedTask,
      tags: processedTags
    };
    
    onSave(finalTask);
    setIsEditing(false);
  };

  if (!task) return null;

  // Generate unique ID for form field IDs
  const formId = Math.random().toString(36).substring(7);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-400">
            {isEditing ? "Edit Task" : "Task Details"}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Basic Information Section */}
            <div className="border-b border-gray-700 pb-4">
              <h4 className="text-md font-semibold mb-3 text-gray-100">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor={`title-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Title *</label>
                  <input 
                    id={`title-${formId}`}
                    type="text" 
                    name="title" 
                    value={editedTask.title} 
                    onChange={handleChange}
                    placeholder="Enter task or bug title" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor={`type-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Type *</label>
                  <select 
                    id={`type-${formId}`}
                    name="type" 
                    value={editedTask.type} 
                    onChange={handleChange} 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={editedTask.status} 
                    onChange={handleChange} 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={editedTask.description} 
                    onChange={handleChange}
                    placeholder="Detailed description of the task or bug" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="border-b border-gray-700 pb-4">
              <h4 className="text-md font-semibold mb-3 text-gray-100">Assignment Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assignee */}
                <div>
                  <label htmlFor={`assignee-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Assignee</label>
                  <input 
                    id={`assignee-${formId}`}
                    type="text" 
                    name="assignee" 
                    value={editedTask.assignee} 
                    onChange={handleChange}
                    placeholder="Person assigned to this task" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                {/* Reporter */}
                <div>
                  <label htmlFor={`reporter-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Reporter</label>
                  <input 
                    id={`reporter-${formId}`}
                    type="text" 
                    name="reporter" 
                    value={editedTask.reporter} 
                    onChange={handleChange}
                    placeholder="Person who reported this" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                {/* Project */}
                <div>
                  <label htmlFor={`project-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Project</label>
                  <input 
                    id={`project-${formId}`}
                    type="text" 
                    name="project" 
                    value={editedTask.project} 
                    onChange={handleChange}
                    placeholder="Associated project" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                {/* Team */}
                <div>
                  <label htmlFor={`team-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Team</label>
                  <input 
                    id={`team-${formId}`}
                    type="text" 
                    name="team" 
                    value={editedTask.team} 
                    onChange={handleChange}
                    placeholder="Responsible team" 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Priority and Timeline Section */}
            <div className="border-b border-gray-700 pb-4">
              <h4 className="text-md font-semibold mb-3 text-gray-100">Priority and Timeline</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Priority */}
                <div>
                  <label htmlFor={`priority-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Priority *</label>
                  <select 
                    id={`priority-${formId}`}
                    name="priority" 
                    value={editedTask.priority} 
                    onChange={handleChange} 
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={editedTask.dueDate} 
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                {/* Estimated Hours */}
                <div>
                  <label htmlFor={`estimatedHours-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Est. Hours</label>
                  <input 
                    id={`estimatedHours-${formId}`}
                    type="number" 
                    name="estimatedHours" 
                    value={editedTask.estimatedHours} 
                    onChange={handleChange}
                    placeholder="0.0" 
                    min="0"
                    step="0.5"
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Bug-specific Fields - Only shown when type is "Bug" */}
            {editedTask.type === "Bug" && (
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-md font-semibold mb-3 text-gray-100">Bug Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Environment */}
                  <div>
                    <label htmlFor={`environment-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Environment</label>
                    <select 
                      id={`environment-${formId}`}
                      name="environment" 
                      value={editedTask.environment} 
                      onChange={handleChange} 
                      className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      value={editedTask.reproducibility} 
                      onChange={handleChange} 
                      className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      value={editedTask.severity} 
                      onChange={handleChange} 
                      className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Tags */}
            <div>
              <label htmlFor={`tags-${formId}`} className="block text-sm font-medium mb-1 text-gray-100">Tags</label>
              <input 
                id={`tags-${formId}`}
                type="text" 
                value={tags} 
                onChange={handleTagsChange}
                placeholder="Add tags separated by commas" 
                className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <p className="text-xs text-gray-400 mt-1">Separate tags with commas (e.g., frontend, api, urgent)</p>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-2 pt-2">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 transition duration-200"
              >
                Save Changes
              </button>
              
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <>
            {/* Task Content */}
            <div className="p-6 space-y-6">
              {/* Title & Status */}
              <div className="mb-4">
                <div className={`text-sm font-semibold mb-2 px-2 py-1 rounded inline-block
                  ${task.status === "Open" ? "bg-blue-900 text-blue-200" : 
                    task.status === "Pending Approval" ? "bg-yellow-900 text-yellow-200" : 
                    "bg-green-900 text-green-200"}`
                }>
                  {task.status}
                </div>
                <h2 className="text-2xl font-bold text-white">{task.title}</h2>
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Type</h4>
                  <p className="text-white font-medium">{task.type || "Task"}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Priority</h4>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2
                      ${task.priority === "Critical" || task.priority === "High" ? "bg-red-500" : 
                        task.priority === "Medium" ? "bg-yellow-500" : 
                        "bg-green-500"}`
                    }></span>
                    <span className="text-white font-medium">{task.priority}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Description</h4>
                <div className="bg-gray-700 p-3 rounded text-white">
                  {task.description || "No description provided."}
                </div>
              </div>

              {/* Assignment Information */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-md font-semibold mb-3 text-gray-300">Assignment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Assignee</h4>
                    <p className="text-white">{task.assignee || "Unassigned"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Reporter</h4>
                    <p className="text-white">{task.reporter || "Unknown"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Project</h4>
                    <p className="text-white">{task.project || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Team</h4>
                    <p className="text-white">{task.team || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Timeline & Progress */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-md font-semibold mb-3 text-gray-300">Timeline & Progress</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Due Date</h4>
                    <p className="text-white">{task.dueDate || "Not set"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Est. Hours</h4>
                    <p className="text-white">{task.estimatedHours || "Not estimated"}</p>
                  </div>
                  {task.type === "Bug" && (
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Severity</h4>
                      <p className="text-white">{task.severity || "Medium"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bug-specific details */}
              {task.type === "Bug" && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-md font-semibold mb-3 text-gray-300">Bug Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Environment</h4>
                      <p className="text-white">{task.environment || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Reproducibility</h4>
                      <p className="text-white">{task.reproducibility || "Always"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm text-gray-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with actions */}
            <div className="border-t border-gray-700 p-4 flex justify-end space-x-2">
              {role === "Developer" && task.status === "Open" && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                >
                  Edit Task
                </button>
              )}
              <button 
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-200"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPopup;