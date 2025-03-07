import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const FILE_PATH = './data/data.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const readData = () => {
    try {
        const data  = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

// router get
app.get('/tasks', (req, res) => {
    const data = readData();
    res.json(data);
});

app.get('/tasks/:id', (req, res) => {
    const data = readData();
    const task = data.find((task) => task.id === parseInt(req.params.id));
    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }
    res.json(task);
});

//router post
// {add new task}
app.post('/tasks', (req, res) => {
    try {
        const data = readData();
        const { title, description, deadline } = req.body;
        if(!title || !deadline) {
            res.status(400).json({ message: 'Title and Deadline are required' });
            return;
        }
        const newTask = {
            id: data.length ? data[data.length - 1].id + 1 : 1,
            title,
            description,
            deadline,
            completed: false,
        };
        data.push(newTask);
        writeData(data);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//router put
// {update task}
app.put('/tasks/:id', (req, res) => {
    try {
        const data = readData();
        const task = data.find((task) => task.id === parseInt(req.params.id));
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const { title, description, deadline } = req.body;
        task.title = title;
        task.description = description;
        task.deadline = deadline;
        writeData(data);
        res.json(task[task.id -1]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

// {mark task}
app.put('/tasks/:id/marked', (req, res) => {
    try {
        const data = readData();
        const task = data.find((task) => task.id === parseInt(req.params.id));
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        task.completed = !task.completed;
        writeData(data);
        res.json(task[task.id -1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//router delete
// {delete task}
app.delete('/tasks/:id', (req, res) => {
    try {
        const data = readData();
        const task = data.find((task) => task.id === parseInt(req.params.id));
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const index = data.indexOf(task);
        data.splice(index, 1);
        writeData(data);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

