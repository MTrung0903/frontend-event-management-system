import React, { useState } from 'react';
import { 
  Card, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography 
} from '@mui/material';
import './TaskAdd.css';

const TaskAdd = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignee: '',
    status: 'todo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm task mới vào database
    console.log('New Task:', task);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  return (
    <div className="task-add-container">
      <Typography variant="h4" gutterBottom>
        Add New Task
      </Typography>
      
      <Card className="task-add-card">
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Task Title"
            name="title"
            value={task.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={task.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Mức độ ưu tiên</InputLabel>
            <Select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <MenuItem value="high">Cao</MenuItem>
              <MenuItem value="medium">Trung bình</MenuItem>
              <MenuItem value="low">Thấp</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={task.dueDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Assignee"
            name="assignee"
            value={task.assignee}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={task.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <div className="button-group">
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
            >
              Add Task
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskAdd; 