import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useParams } from "react-router-dom";
import axios from "axios";

export const createTask = async (task) => {
  const response = await axios.post(`http://localhost:8080/man/task`, task, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};
export const fetchEmployees = async (teamId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/man/team/${teamId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.listEmployees || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/task/${taskId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};
export const handleDeleteTask = async (taskId, status, onTaskUpdate) => {
  try {
    if (status?.toLowerCase() === "done") {
      alert("Không thể xóa các task đã hoàn thành!");
      return;
    }
    const isConfirmed = window.confirm(
      "Lưu ý: Các subtask của task hiện tại cũng sẽ bị xóa. Bạn muốn thực hiện thao tác này?"
    );
    if (!isConfirmed) return;
    const response = await deleteTask(taskId);
    if (response.statusCode === 0) {
      alert("Xóa task thành công!");
      onTaskUpdate((prevTasks) =>
        prevTasks.filter((task) => task.taskId !== taskId)
      );
    } else {
      alert(
        `Không thể xóa task. Lỗi: ${response.message || "Không rõ lý do."}`
      );
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Đã xảy ra lỗi khi xóa task. Vui lòng thử lại sau.");
  }
};
export const deleteSubTask = async (subtakId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/subtask/${subtakId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};
export const handleDeleteSubtask = async (
  subtaskId,
  status,
  onSubtaskUpdate
) => {
  try {
    if (status?.toLowerCase() === "done") {
      alert("Không thể xóa các subtask đã hoàn thành!");
      return;
    }
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa subtask này?"
    );
    if (!isConfirmed) return;
    const response = await deleteSubTask(subtaskId);
    if (response.statusCode === 0) {
      alert("Xóa subtask thành công!");
      onSubtaskUpdate((prevSubtasks) =>
        prevSubtasks.filter((subtask) => subtask.subTaskId !== subtaskId)
      );
    } else {
      alert(
        `Không thể xóa subtask. Lỗi: ${response.message || "Không rõ lý do"}`
      );
    }
  } catch (error) {
    console.error("Error deleting subtask:", error);
    alert("Đã xảy ra lỗi khi xóa subtask. Vui lòng thử lại sau.");
  }
};
export const saveSubtask = async (taskId, formData) => {
  const formattedTaskDl = new Date(formData.subTaskDeadline)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  formData.subTaskDeadline = formattedTaskDl;
  try {
    const response = await axios.post(
      `http://localhost:8080/man/subtask/${taskId}`,
      formData,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    console.log("Subtask saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving subtask:", error);
    throw error;
  }
};
export const updateTask = async (task) => {
  const response = await axios.put(`http://localhost:8080/man/task`, task, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data.data;
};

export const updateSubtask = async (subtask) => {
  const response = await axios.put(
    `http://localhost:8080/man/subtask`,
    subtask,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data.data;
};
const UpdateSubtaskDialog = ({ subtask, employees, onClose, onSave }) => {
  const [subTaskName, setSubTaskName] = useState(subtask.subTaskName);
  const [subTaskDesc, setSubTaskDesc] = useState(subtask.subTaskDesc);
  const [subTaskDeadline, setSubTaskDeadline] = useState(subtask.subTaskDeadline);
  const [status, setStatus] = useState(subtask.status);
  const [employeeId, setEmployeeId] = useState(subtask.employeeId);

  const handleSave = async () => {
    try {
      const updatedSubtask = {
        ...subtask,
        subTaskName,
        subTaskDesc,
        subTaskDeadline,
        status,
        employeeId,
      };
      await updateSubtask(updatedSubtask);
      onSave(updatedSubtask);
      alert("Subtask updated successfully!");
      onClose();  
    } catch (error) {
      console.error("Error updating subtask:", error);
      alert("Failed to update subtask. Please try again.");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Subtask</DialogTitle>
      <DialogContent>
        <TextField
          label="Subtask Name"
          value={subTaskName}
          onChange={(e) => setSubTaskName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={subTaskDesc}
          onChange={(e) => setSubTaskDesc(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Deadline"
          type="datetime-local"
          value={subTaskDeadline}
          onChange={(e) => setSubTaskDeadline(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Status"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="to do">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        <TextField
          label="Assigned Employee"
          select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.fullName}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const SubTaskList = ({ subTasks, onSubtaskUpdate, employees }) => {
  const [currentSubtask, setCurrentSubtask] = useState(null);

  const handleUpdateSubtaskClick = (subtask) => {
    setCurrentSubtask(subtask);
  };

  const handleSaveUpdatedSubtask = (updatedSubtask) => {
    onSubtaskUpdate((prevSubtasks) =>
      prevSubtasks.map((st) =>
        st.subTaskId === updatedSubtask.subTaskId ? updatedSubtask : st
      )
    );
    setCurrentSubtask(null); 
  };

  const handleCloseDialog = () => {
    setCurrentSubtask(null);  
  };

  const handleDeleteSubtask = async (subtaskId, status) => {
    try {
      if (status?.toLowerCase() === "done") {
        alert("Không thể xóa các subtask đã hoàn thành!");
        return;
      }
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa subtask này?");
      if (!isConfirmed) return;
      const response = await deleteSubTask(subtaskId);
      if (response.statusCode === 0) {
        alert("Xóa subtask thành công!");
        onSubtaskUpdate((prevSubtasks) =>
          prevSubtasks.filter((subtask) => subtask.subTaskId !== subtaskId)
        );
      } else {
        alert(`Không thể xóa subtask. Lỗi: ${response.message || "Không rõ lý do"}`);
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
      alert("Đã xảy ra lỗi khi xóa subtask. Vui lòng thử lại sau.");
    }
  };

  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#f9f9f9" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subtask Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subTasks.map((subTask) => (
            <TableRow key={subTask.subTaskId}>
              <TableCell>{subTask.subTaskName}</TableCell>
              <TableCell>{subTask.subTaskDesc}</TableCell>
              <TableCell>{subTask.subTaskDeadline}</TableCell>
              <TableCell>{subTask.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleUpdateSubtaskClick(subTask)}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleDeleteSubtask(subTask.subTaskId, subTask.status)
                  }
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentSubtask && (
        <UpdateSubtaskDialog
          subtask={currentSubtask}
          employees={employees}
          onClose={handleCloseDialog}
          onSave={handleSaveUpdatedSubtask}
        />
      )}
    </TableContainer>
  );
};
const AddTaskDialog = ({ onClose, onSave, eventId, teamId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDl, setTaskDl] = useState("2024-12-31T10:00");
  const [taskStatus, setTaskStatus] = useState("to do");

  const handleSave = async () => {
    try {
      const formattedTaskDl = new Date(taskDl)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const newTask = {
        taskName,
        taskDesc,
        taskDl: formattedTaskDl,
        taskStatus,
        eventId: parseInt(eventId),
        teamId,
      };
      const createdTask = await createTask(newTask);
      onSave((prevTasks) => [...prevTasks, createdTask]);
      alert("Task saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Task Deadline"
          type="datetime-local"
          value={taskDl}
          onChange={(e) => setTaskDl(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Task Status"
          select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="to do">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const UpdateTaskDialog = ({ task, onClose, onSave }) => {
  const [taskName, setTaskName] = useState(task.taskName);
  const [taskDesc, setTaskDesc] = useState(task.taskDesc);
  const [taskDl, setTaskDl] = useState(task.taskDl);
  const [taskStatus, setTaskStatus] = useState(task.taskStatus);

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...task,
        taskName,
        taskDesc,
        taskDl,
        taskStatus,
      };
      await updateTask(updatedTask);
      onSave(updatedTask);
      alert("Task updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Task Deadline"
          type="datetime-local"
          value={taskDl}
          onChange={(e) => setTaskDl(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Task Status"
          select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="to do">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function TaskList({ tasks, setTasks, teamId }) {
  const { eventId } = useParams();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const handleSaveTask = (createdTask) => {
    setTasks((prevTasks) => [...prevTasks, createdTask]);
    //alert("Task saved successfully!");
  };

  const handleDeleteTask = async (taskId, status) => {
    try {
      if (status?.toLowerCase() === "done") {
        alert("Không thể xóa các task đã hoàn thành!");
        return;
      }
      const isConfirmed = window.confirm(
        "Lưu ý: Các subtask của task hiện tại cũng sẽ bị xóa. Bạn muốn thực hiện thao tác này?"
      );
      if (!isConfirmed) return;
      const response = await deleteTask(taskId);
      if (response.statusCode === 0) {
        alert("Xóa task thành công!");
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.taskId !== taskId)
        );
      } else {
        alert(
          `Không thể xóa task. Lỗi: ${response.message || "Không rõ lý do."}`
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Đã xảy ra lỗi khi xóa task. Vui lòng thử lại sau.");
    }
  };
  const handleAddTask = () => {
    setShowDialog(true);
  };
  const handleExpandClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };
  const handleOpenDialog = (taskId) => {
    setFormData((prev) => ({ ...prev, taskId }));
    setOpenDialog(true);
  };
  useEffect(() => {
    if (teamId) {
      const getEmployees = async () => {
        try {
          const data = await fetchEmployees(teamId);
          setEmployees(data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };
      getEmployees();
    }
  }, [teamId]);
  const [formData, setFormData] = useState({
    subTaskName: "",
    subTaskDesc: "",
    subTaskDeadline: "",
    status: "",
    employeeId: "",
    taskId: null,
  });
  const handleCloseDialog = () => {
    setFormData({
      subTaskName: "",
      subTaskDesc: "",
      subTaskDeadline: "",
      status: "",
      employeeId: "",
      taskId: null,
    });
    setOpenDialog(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await saveSubtask(formData.taskId, formData);
      handleCloseDialog();
      if (response.data === true) {
        alert("Subtask saved successfully!");
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === formData.taskId
              ? { ...task, listSubTasks: [...task.listSubTasks, response.data] }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error saving subtask:", error);
    } finally {
      setLoading(false);
    }
  };

  const [currentTask, setCurrentTask] = useState(null);
  const [updateTaskDialogOpen, setUpdateTaskDialogOpen] = useState(false);

  const handleUpdateTaskClick = (task) => {
    setCurrentTask(task);
    setUpdateTaskDialogOpen(true);
  };

  const handleSaveUpdatedTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.taskId === updatedTask.taskId ? updatedTask : t))
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <Button
            type="submit"
            variant="contained"
            onClick={handleAddTask}
            style={{
              backgroundColor: "#3f51b5",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "8px 16px",
              marginLeft: "20px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Add Task
          </Button>
          {showDialog && (
            <AddTaskDialog
              onClose={() => setShowDialog(false)}
              onSave={handleSaveTask}
              eventId={eventId}
              teamId={teamId}
            />
          )}
          <TableRow>
            <TableCell>Task Name</TableCell> <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell> <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <React.Fragment key={task.taskId}>
              <TableRow>
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.taskDesc}</TableCell>
                <TableCell>{task.taskDl}</TableCell>
                <TableCell>{task.taskStatus}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleExpandClick(task.taskId)}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDeleteTask(task.taskId, task.taskStatus)
                    }
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={() => handleUpdateTaskClick(task)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  {updateTaskDialogOpen && currentTask && (
                    <UpdateTaskDialog
                      task={currentTask}
                      onClose={() => setUpdateTaskDialogOpen(false)}
                      onSave={handleSaveUpdatedTask}
                    />
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => handleOpenDialog(task.taskId)}
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "#ffffff",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      marginLeft: "10px",
                    }}
                  >
                    Add Subtask
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <Collapse
                    in={expandedTaskId === task.taskId}
                    timeout="auto"
                    unmountOnExit
                  >
                    <SubTaskList
                      subTasks={task.listSubTasks || []}
                      onSubtaskUpdate={(updatedSubtasks) =>
                        setTasks((prevTasks) =>
                          prevTasks.map((t) =>
                            t.taskId === task.taskId
                              ? { ...t, listSubTasks: updatedSubtasks }
                              : t
                          )
                        )
                      }
                      employees={employees}
                    />
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Subtask</DialogTitle>
        <DialogContent>
          <TextField
            label="Subtask Name"
            name="subTaskName"
            value={formData.subTaskName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="subTaskDesc"
            value={formData.subTaskDesc}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Deadline"
            name="subTaskDeadline"
            type="datetime-local"
            value={formData.subTaskDeadline}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Status"
            name="status"
            select
            value={formData.status}
            onChange={handleInputChange}
          >
            <MenuItem value="To do">To do</MenuItem>
            <MenuItem value="Doing">Doing</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Assigned Employee"
            name="employeeId"
            select
            value={formData.employeeId}
            onChange={handleInputChange}
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.fullName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default TaskList;
