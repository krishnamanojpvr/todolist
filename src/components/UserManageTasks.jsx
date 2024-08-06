import React, { useState, useEffect } from "react";
import axios from "axios";
import './UserManageTasks.css';

export default function UserManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    taskName: '',
    endDate: '',
    priority: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'taskName', direction: 'asc' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://tdlback.vercel.app/api/usertasks/gettasks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data);
      } catch (err) {
        setError("Error fetching tasks. Please try again.");
        setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      }
    };

    fetchTasks();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction });
  };

  const handleShowModal = (task) => {
    setCurrentTask(task);
    setUpdatedTask({
      taskName: task.taskName,
      endDate: task.endDate,
      priority: task.priority
    });
    setShowModal(true);
  };

  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `https://tdlback.vercel.app/api/usertasks/updatetask/${currentTask._id}`,
        {updatedTask,token}
        // {
        //   headers: {
        //     Authorization: `${token}`
        //   }
        // }
      );
      setTasks(tasks.map(task =>
        task._id === currentTask._id ? { ...task, ...updatedTask } : task
      ));
      setShowModal(false);
    } catch (err) {
      setError("Error updating task. Please try again.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  const handleDeleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://tdlback.vercel.app/api/usertasks/deletetask/${currentTask._id}`,
        {token}
        // {
        //   headers: {
        //     Authorization: `${token}`
        //   }
        // }
      );
      setTasks(tasks.filter(task => task._id !== currentTask._id));
      setShowModal(false);
    } catch (err) {
      setError("Error deleting task. Please try again.");
      setTimeout(() => setError(""), 3000); 
    }
  };

  return (
    <div className="container usermanagetasks mt-5">
      <h1 className="text-center mb-4">Your Tasks</h1>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="border border-dark">
            <tr>
              <th onClick={() => handleSort('taskName')}>
                Task Name {sortConfig.key === 'taskName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('endDate')}>
                End Date {sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('priority')}>
                Priority {sortConfig.key === 'priority' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No tasks found</td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.taskName}</td>
                  <td>{task.endDate}</td>
                  <td>{task.priority}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowModal(task)}
                    >
                      Manage Task
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && currentTask && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage Task</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedTask.taskName}
                    onChange={(e) => setUpdatedTask({ ...updatedTask, taskName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={updatedTask.endDate}
                    onChange={(e) => setUpdatedTask({ ...updatedTask, endDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <input
                    type="number"
                    className="form-control"
                    value={updatedTask.priority}
                    onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateTask}>Update</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteTask}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
