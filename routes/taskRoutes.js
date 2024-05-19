const express = require('express');
const router = express.Router();
const Task = require('./../models/task');


//route to get all task

router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find()
        res.status(tasks);
    } catch (err) {
        res.status(500).json({ message: error.message });
    }
});

//Route to get a task by Id
router.get('tasks/:id', async(req, res) => {
    try {

        const task = await Task.findById(req.params.id);
        if (!task) {

            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//route to create a new task

router.post('/tasks', async(req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed || false
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//route to update a task

router.put('/task/:id', async(res, req) => {
    try {
        const task = task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = req.body.title;
        task.description = req.body.description;
        task.completed = req.body.completed || false;
        const updatedTask = task.save();
        res.json(updatedTask);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//route to delete a task by Id

router.delete('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ error: "task not found" });
        }
        await task.remove();
        res.json({ message: "task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;