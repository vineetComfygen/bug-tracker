import { useEffect, useState, useRef } from "react";

const TimeTracker = ({ task, onTimeUpdate }) => {
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

  // Auto-start timer when a new task is created
  useEffect(() => {
    // If this is a new task (assuming tasks start with "Open" status)
    // and the task has an ID (meaning it's been saved)
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

  return (
    <div className="mt-2 p-2 bg-gray-700 rounded">
      <p className="text-sm"><b>Time Spent:</b> {formatTime(timeSpent)}</p>
      <div className="mt-1">
        {isTracking ? (
          <button 
            onClick={stopTracking}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded"
          >
            Stop Timer
          </button>
        ) : (
          <button 
            onClick={startTracking}
            className="bg-green-500 text-white px-3 py-1 text-sm rounded"
            disabled={task.status === "Closed" || task.status === "Pending Approval"}
          >
            Start Timer
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;