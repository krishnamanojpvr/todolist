const express = require("express");
const router = express.Router();
const userschema = require("../Models/UserSchema.js");
const jwt = require("jsonwebtoken");
const { Suprsend } = require("@suprsend/node-sdk");
router.use(express.json());
const { v4: uuidv4 } = require('uuid');

const generateUniqueTaskId = async () => {
  let unique = false;
  let taskId;
  
  while (!unique) {
    taskId = uuidv4();
    const taskExists = await userschema.findOne({ "tasks.id": taskId });
    if (!taskExists) {
      unique = true;
    }
  }
  
  return taskId;
};

// const supr_client = new Suprsend(process.env.SUPRSEND_WORKSPACE_KEY, process.env.SUPRSEND_WORKSPACE_SECRET);

router.post("/addtask", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).send("No authorization header found");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).send("No token found");
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const username = decoded.username;
    const name = decoded.name;
    const user = await userschema.findOne({ username, name });
    const { taskName, endDate, priority } = req.body;
    if (!taskName || !priority || !endDate) {
      return res.status(400).send("Please fill all the fields");
    }
    
    try {
      const taskId = await generateUniqueTaskId();
      user.tasks.push({ _id: taskId,taskName, endDate, priority });
      await user.save();
      res.status(200).send("Task added successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding task. Please try again.");
    }
  });
});

router.get("/gettasks", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).send("No authorization header found");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).send("No token found");
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const username = decoded.username;
    const name = decoded.name;
    try {
      const user = await userschema.findOne({ username, name });
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(user.tasks);
    } catch (err) {
      res.status(500).send("Error fetching tasks. Please try again.");
    }
  });
});

router.put('/updatetask/:id', async (req, res) => {
  // const { authhead } = req.headers.authorization;
  // console.log(authhead);

  // if (!authhead) {
  //   return res.status(400).send("No user found");
  // }

  // const token = authhead.split(" ")[1];
  // if(!token){
  //   return res.status(400).send("No token found");
  // }

  const {token} = req.body;

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: "Invalid token" });
    }

    const username = decoded.username;
    const name = decoded.name;
    const user = await userschema.findOne({ username, name });

    const taskId = req.params.id;
    console.log(taskId)
    const {updatedTask} = req.body;
    console.log(updatedTask)

    const taskIndex = user.tasks.findIndex(task => task._id === taskId);
    if (taskIndex === -1) {
      return res.status(404).send("Task not found");
    }

    user.tasks[taskIndex] = { ...user.tasks[taskIndex], ...updatedTask };

    try {
      await user.save();
      res.status(200).send("Task updated successfully");
    } catch (err) {
      res.status(500).send("Error updating task. Please try again.");
    }
  });
});


router.put('/deletetask/:id', async (req, res) => {
  // const { token } = req.headers.authorization?.split(' ')[1];

  // if (!token) {
  //   return res.status(400).send("No user found");
  // }

  const {token} = req.body;
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: "Invalid token" });
    }

    const username = decoded.username;
    const name = decoded.name;
    const user = await userschema.findOne({ username, name });

    const taskId = req.params.id;

    const taskIndex = user.tasks.findIndex(task => task._id === taskId);
    if (taskIndex === -1) {
      return res.status(404).send("Task not found");
    }

    user.tasks.splice(taskIndex, 1);

    try {
      await user.save();
      res.status(200).send("Task deleted successfully");
    } catch (err) {
      res.status(500).send("Error deleting task. Please try again.");
    }
  });
});

module.exports = router;
