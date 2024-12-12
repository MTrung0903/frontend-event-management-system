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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

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
    //console.log("Subtask saved successfully:", response.data);
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
  const formattedTaskDl = new Date(subtask.subTaskDeadline)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
  subtask.subTaskDeadline = formattedTaskDl;
  const response = await axios.put(
    `http://localhost:8080/man/subtask`,
    subtask,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data;
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
      const response = await updateSubtask(updatedSubtask);
      if (response.data === true) {
       
      onSave(updatedSubtask);
      }
     else {
      Swal.fire({
        title: "Error",
        text: response.msg || "",
        icon: "error",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
    }
      onClose();  
    } catch (error) {
      console.error("Error updating subtask:", error);
      Swal.fire({
        title: "Update",
        text: "Cập nhật subtask thất bại. Vui lòng thử lại",
        icon: "error",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
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
        Swal.fire({
          icon: 'error',
          title:'Delete',
          text: 'Không thể xóa các subtask đã hoàn thành!',
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        return;
      }
  
      const { isConfirmed } = await Swal.fire({
        title:'Delete',
        text: 'Bạn có chắc chắn muốn xóa subtask này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Hủy',
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
  
      if (!isConfirmed) return;
  
      const response = await deleteSubTask(subtaskId);
  
      if (response.statusCode === 0) {
        Swal.fire({
          icon: 'success',
          title:'Delete',
          text: 'Xóa subtask thành công!',
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        onSubtaskUpdate((prevSubtasks) =>
          prevSubtasks.filter((subtask) => subtask.subTaskId !== subtaskId)
        );
      } else {
        Swal.fire({
          icon: 'error',
          title:'Delete',
          text: `Không thể xóa subtask. Lỗi: ${response.message || "Không rõ lý do"}`,
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
      Swal.fire({
        icon: 'error',
        title:'Delete',
        text: 'Đã xảy ra lỗi khi xóa subtask. Vui lòng thử lại sau.',
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
    }
  };

  return (
    <TableContainer component={Paper} style={{  boxShadow:"none" }} m>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subtask Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned</TableCell>
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
              <TableCell>{subTask.employeeId}</TableCell>
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
      const response = await createTask(newTask);

      if (response.data) {
        Swal.fire({
          title: "Success",
          text: response.msg || "Thêm task thành công",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
  
        // Cập nhật danh sách task
        onSave((prevTasks) => [...prevTasks, newTask]);
  
        // Đóng modal
        onClose();
      } else {
         // Đóng modal
         onClose();
        Swal.fire({
          title: "Error",
          text: response.msg || "Không thể thêm task",
          icon: "error",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
     
      Swal.fire({
        title: "Delete task",
        text: "Xóa task thất bại. Hãy thử lại",
        icon: "error",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
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
      Swal.fire({
        title: "Update",
        text: "Cập nhật task thành công",
        icon: "success",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire({
        title: "Update",
        text: "Cập nhật task thất bại. Hãy thử lại",
        icon: "error",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
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
  };

  const handleDeleteTask = async (taskId, status) => {
    try {
      if (status?.toLowerCase() === "done") {
        Swal.fire({
          icon: 'error',
          title: 'Không thể xóa các task đã hoàn thành!',
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        return;
      }
  
      const { isConfirmed } = await Swal.fire({
        title: 'Lưu ý: Các subtask của task hiện tại cũng sẽ bị xóa. Bạn muốn thực hiện thao tác này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Hủy',
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
  
      if (!isConfirmed) return;
  
      const response = await deleteTask(taskId);
  
      if (response.statusCode === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Xóa task thành công!',
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.taskId !== taskId)
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: `Không thể xóa task. Lỗi: ${response.message || "Không rõ lý do."}`,
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        icon: 'error',
        title: 'Đã xảy ra lỗi khi xóa task. Vui lòng thử lại sau.',
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
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
  
      // Đóng dialog sau khi gửi thành công
      handleCloseDialog();
  
      // Xử lý thông báo dựa trên response từ backend
      if (response.data === true) {
        Swal.fire({
          title: "Success",
          text: response.msg || "Tạo subtask thành công",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
  
        // Cập nhật danh sách subtasks cho task hiện tại
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === formData.taskId
              ? { ...task, listSubTasks: [...task.listSubTasks, formData] }
              : task
          )
        );
      } else {
        Swal.fire({
          title: "Error",
          text: response.msg || "Không thể tạo subtask",
          icon: "error",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Đã xảy ra lỗi khi tạo subtask.",
        icon: "error",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
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
    <TableContainer component={Paper}  sx={{ boxShadow: "0 0px 2px rgba(0, 0, 0, 0.1)"}}>
      <Box display="flex" justifyContent="flex-end">
          <Button
              type="submit"
              variant="contained"
              onClick={handleAddTask}
              style={{backgroundColor: "#3f51b5",color: "#ffffff",padding: "8px 16px", marginRight:"50px"}}> 
              Add Task
          </Button>
        </Box>
      {/*Bảng task*/}
      <Table>
        <TableHead>  
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
                    onClick={() =>handleDeleteTask(task.taskId, task.taskStatus)}
                    title="Delete Subtask"
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={() => handleUpdateTaskClick(task)} title="Edit Subtask">
                    <EditOutlinedIcon />
                  </IconButton>
                  {updateTaskDialogOpen && currentTask && (
                    <UpdateTaskDialog
                      task={currentTask}
                      onClose={() => setUpdateTaskDialogOpen(false)}
                      onSave={handleSaveUpdatedTask}
                    />
                  )}
                 <IconButton
                    onClick={() => handleOpenDialog(task.taskId)}
                    style={{
                      cursor: "pointer",
                      padding: "8px", 
                      marginLeft: "10px",
                    }}
                    title="Add Subtask"
                  >
                    <PlaylistAddIcon />
                  </IconButton>
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
            <MenuItem value="to do">To do</MenuItem>
            <MenuItem value="doing">Doing</MenuItem>
            <MenuItem value="done">Done</MenuItem>
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
