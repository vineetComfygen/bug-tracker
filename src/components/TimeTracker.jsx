import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assuming this is where user context is kept

const TimeTracker = ({ task, onTimeUpdate, onStatusChange }) => {
  const { user } = useContext(AuthContext); // Get current user to check if they're a manager
  const [timeSpent, setTimeSpent] = useState(() => {
    return localStorage.getItem(`time-${task.id}`)
      ? parseInt(localStorage.getItem(`time-${task.id}`), 10)
      : 0;
  });

  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef(null);
  
  // Format seconds into readable time format (HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save time whenever it changes
  useEffect(() => {
    localStorage.setItem(`time-${task.id}`, timeSpent.toString());
    if (onTimeUpdate) {
      onTimeUpdate(task.id, timeSpent);
    }
  }, [timeSpent, task.id, onTimeUpdate]);

  // Auto-start timer when a task is open
  useEffect(() => {
    // Auto-start when task is in "Open" status
    if (task.id && task.status === "Open" && !isTracking) {
      startTracking();
    }
  }, [task.id, task.status, isTracking]);

  // Auto-stop timer when task is approved (status changes to "Closed")
  useEffect(() => {
    if (task.status === "Closed" && isTracking) {
      stopTracking();
    }
  }, [task.status, isTracking]);

  // Also auto-stop when status changes to "Pending Approval"
  useEffect(() => {
    if (task.status === "Pending Approval" && isTracking) {
      stopTracking();
    }
  }, [task.status, isTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    if (task.status !== "Closed" && task.status !== "Pending Approval") {
      setIsTracking(true);
      intervalRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function for managers to reopen a task
  const reopenTask = () => {
    if (onStatusChange) {
      onStatusChange(task.id, "Open");
      // Timer will auto-start due to the useEffect above
    }
  };

  return (
    <div className="mt-2 p-2 bg-gray-700 rounded">
      <p className="text-sm"><b>Time Spent:</b> {formatTime(timeSpent)}</p>
      
      {/* Only show the stop button when tracking is active */}
      {isTracking && (
        <div className="mt-1">
          <button 
            onClick={stopTracking}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded"
          >
            Stop Timer
          </button>
        </div>
      )}
      
      {/* Manager-only reopen option */}
      {user?.role === "Manager" && (task.status === "Pending Approval" || task.status === "Closed") && (
        <div className="mt-2">
          <button 
            onClick={reopenTask}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
          >
            Reopen Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;