import "./UserHome.css";
import { useState } from "react";
import axios from "axios";
import Loader from "./Loader";

export default function UserAddTasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName || !endDate || !priority) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (tasks.some((task) => task.priority === parseInt(priority))) {
      setMessage("Priority must be unique.");
      return;
    }

    try {
      setLoader(true);
      const newTask = {
        taskName: taskName,
        endDate,
        priority: parseInt(priority),
      };
      const token = localStorage.getItem("token");
      
      await axios.post("https://tdlback.vercel.app/api/usertasks/addtask", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, newTask]);
      setTaskName("");
      setEndDate("");
      setPriority("");
      setMessage("");
      setLoader(false);
      let username = localStorage.getItem("username");
      await axios.post("https://tdlback.vercel.app/api/subsid/trigger",{username});
    } catch (error) {
      setLoader(false);
      
    }
  };

  return (
    <div className="container userhome d-flex justify-content-center min-vh-100">
      <div className="col-12 col-md-6 col-lg-4">
        <form
          onSubmit={handleAddTask}
          className="mt-5 register-form rounded-3 p-4 border border-black"
        >
          <h1 className="text-center mb-4">Add Task</h1>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="text"
              className="form-control border border-black"
              id="floatingTaskName"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <label htmlFor="floatingTaskName">Task Name</label>
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="date"
              className="form-control border border-black"
              id="floatingEndDate"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <label htmlFor="floatingEndDate">End Date</label>
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="number"
              className="form-control border border-black"
              id="floatingPriority"
              placeholder="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            />
            <label htmlFor="floatingPriority">Priority</label>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-dark w-100">
              Add Task
            </button>
          </div>
          {message && (
            <div className="text-danger text-center mt-2">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
