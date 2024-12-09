import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";

const fetchTasks = async (eventId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/man/event/${eventId}/tasks`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const fetchEmployees = async (teamId) => {
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

const saveSubtask = async (taskId, formData) => {
  const formattedTaskDl = new Date(formData.subTaskDeadline)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  formData.subTaskDeadline = formattedTaskDl;

  try {
    const response = await axios.post(
      `http://localhost:8080/man/subtask/${taskId}`,
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log("Subtask saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving subtask:", error);
    throw error;
  }
};

const TaskSubTasks = () => {
  const { eventId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    subTaskName: "",
    subTaskDesc: "",
    subTaskDeadline: "",
    status: "",
    employeeId: "",
    taskId: null,
  });

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(eventId);
        setTasks(data);

        if (data.length > 0 && data[0].teamId) {
          setTeamId(data[0].teamId);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [eventId, tasks]);

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
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  // Mở dialog và thiết lập taskId
  const handleOpenDialog = (taskId, teamId) => {
    setOpenDialog(true);
    setFormData((prev) => ({ ...prev, taskId: taskId, teamId: teamId }));
  };

  // Đóng dialog
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm gửi subtask đến API
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await saveSubtask(formData.taskId, formData);
      console.log("Subtask saved successfully:", response);
      await fetchTasks(eventId);
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving subtask:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ width: "100%", typography: "body1", marginLeft: "15px" }}>
      <Header title="Công việc cho sự kiện" subtitle="Danh sách công việc" />
      {/* Tabs for Tasks */}
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="tab công việc">
        {tasks.map((task, index) => (
          <Tab label={task.taskName} key={task.taskId} />
        ))}
      </Tabs>

      {/* Tab Panels */}
      {tasks.map((task, index) => (
        <Box
          role="tabpanel"
          hidden={activeTab !== index}
          key={task.taskId}
          sx={{ p: 2 }}
          onClick={() => handleOpenDialog(task.taskId, task.teamId)}
        >
          {activeTab === index && (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Chi tiết công việc</Typography>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography sx={{ fontWeight: "bold", minWidth: "150px" }}>
                    Tên:
                  </Typography>
                  <Typography>{task.taskName}</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography sx={{ fontWeight: "bold", minWidth: "150px" }}>
                    Mô tả:
                  </Typography>
                  <Typography>{task.taskDesc}</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography sx={{ fontWeight: "bold", minWidth: "150px" }}>
                    Thời hạn:
                  </Typography>
                  <Typography>{task.taskDl}</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography sx={{ fontWeight: "bold", minWidth: "150px" }}>
                    Trạng thái:
                  </Typography>
                  <Typography>{task.taskStatus}</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography sx={{ fontWeight: "bold", minWidth: "150px" }}>
                    Nhóm:
                  </Typography>
                  <Typography>{task.teamName || "N/A"}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Công việc nhánh
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleOpenDialog}
              >
                Thêm công việc nhánh 
              </Button>
              {task.listSubTasks && task.listSubTasks.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên công việc nhánh</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Thời gian bắt đầu</TableCell>
                        <TableCell>Thời hạn</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Mã nhân viên</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.listSubTasks.map((subTask) => (
                        <TableRow key={subTask.subTaskId}>
                          <TableCell>{subTask.subTaskName}</TableCell>
                          <TableCell>{subTask.subTaskDesc}</TableCell>
                          <TableCell>{subTask.subTaskStart}</TableCell>
                          <TableCell>{subTask.subTaskDeadline}</TableCell>
                          <TableCell>{subTask.status}</TableCell>
                          <TableCell>{subTask.employeeId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>Không có công việc nhánh khả dụng</Typography>
              )}
            </>
          )}
        </Box>
      ))}
      {/* Dialog thêm subtask */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thêm công việc nhánh</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Subtask Name"
            name="subTaskName"
            value={formData.subTaskName}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="subTaskDesc"
            value={formData.subTaskDesc}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Deadline"
            name="subTaskDeadline"
            type="datetime-local"
            value={formData.subTaskDeadline}
            onChange={handleInputChange}
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
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskSubTasks;
