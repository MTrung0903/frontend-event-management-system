import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  updateTask,
  deleteTask,
  createTask,
  getTeamsForTask,
  assignedTeam,
} from "../../routes/route";
import { useParams } from "react-router-dom";

// Component Modal Dialog for Add Task
const AddTaskDialog = ({ onClose, onSave, eventId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDl, setTaskDl] = useState("2024-12-31 10:00:00.0");
  const [taskStatus, setTaskStatus] = useState("to do");
  const [teamId, setTeamId] = useState(0);

  const handleSave = () => {
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

    onSave(newTask);
    onClose();
  };

  return (
    <div style={dialogOverlayStyle}>
      <div style={dialogContainerStyle}>
        <h3>Tạo công việc mới</h3>
        <div>
          <label>Tên công việc</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Chi tiết</label>
          <input
            type="text"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Thời hạn </label>
          <input
            type="datetime-local"
            value={taskDl}
            onChange={(e) => setTaskDl(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Trạng thái</label>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="to do">Chuẩn bị</option>
            <option value="doing">Đang làm</option>
            <option value="done">Đã hoàn thành</option>
          </select>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Hủy
          </button>
          <button onClick={handleSave} style={saveButtonStyle}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    "to do": [],
    doing: [],
    done: [],
  });
  const [showDialog, setShowDialog] = useState(false);
  const { eventId } = useParams();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch initial tasks
    const loadTasks = async () => {
      const tasks = await fetchTasks(eventId);
      const groupedTasks = {
        "to do": tasks.filter((task) => task.taskStatus === "to do"),
        doing: tasks.filter((task) => task.taskStatus === "doing"),
        done: tasks.filter((task) => task.taskStatus === "done"),
      };
      setColumns(groupedTasks);
    };
    loadTasks();
  }, [columns]);

  const handleStatusChange = async (taskId, newStatus, columnId) => {
    // Kiểm tra nếu chưa chọn team, thì không cho phép thay đổi trạng thái
    const task = columns[columnId].find((task) => task.taskId === taskId);
    if (!task.teamId || task.teamId === 0) {
      alert("Assigned team chưa được chỉ định");
      return;
    }

    // Kiểm tra nếu trạng thái chuyển đổi hợp lệ
    const validTransitions = {
      "to do": ["doing", "done"],
      doing: ["to do", "done"],
      done: ["to do", "doing"],
    };

    if (!validTransitions[task.taskStatus].includes(newStatus)) {
      alert("Invalid status transition");
      return;
    }

    task.taskStatus = newStatus;

    try {
      // Cập nhật task qua API
      const response = await updateTask(task);
      if (response.success) {
        // Nếu cập nhật thành công, cập nhật lại giao diện
        const updatedColumns = { ...columns };
        updatedColumns[columnId] = updatedColumns[columnId].filter(
          (t) => t.taskId !== taskId
        );
        updatedColumns[newStatus].push(task);

        setColumns(updatedColumns);
      } else {
        //alert('Task update failed');
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("There was an error updating the task");
    }
  };

  const fetchTeams = async (eventId, taskId) => {
    try {
      const fetchedTeams = await getTeamsForTask(eventId, taskId);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleDelete = async (taskId, columnId) => {
    await deleteTask(taskId);
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.taskId !== taskId),
    }));
  };
  const handleAssignedTeamChange = async (taskId, teamId) => {
    try {
      const responseData = await assignedTeam(taskId, teamId);
      console.log("Response Data:", responseData);
      if (responseData === true) {
        alert("Team assigned successfully!");
      } else {
        alert("Failed to assign team");
      }
    } catch (error) {
      console.error("Error assigning team:", error);
      alert("Error while assigning team");
    }
  };

  const handleAddTask = () => {
    setShowDialog(true);
  };

  const handleSaveTask = async (newTask) => {
    // Thêm task vào API
    await createTask(newTask);

    // Fetch tất cả task lại để lấy danh sách mới nhất
    const tasks = await fetchTasks(eventId);
    const groupedTasks = {
      "to do": tasks.filter((task) => task.taskStatus === "to do"),
      doing: tasks.filter((task) => task.taskStatus === "doing"),
      done: tasks.filter((task) => task.taskStatus === "done"),
    };

    // Cập nhật lại state với danh sách task mới
    setColumns(groupedTasks);
  };

  return (
    <div style={{ ...kanbanContainerStyle }}>
      {" "}
      {Object.keys(columns).map((columnId) => (
        <div key={columnId} style={{ ...kanbanColumnStyle }}>
          <h3 style={{ textAlign: "center", color: "#3f51b5" }}>
            {columnId.toUpperCase()}
          </h3>
          {columns[columnId].map((task) => (
            <div
              key={task.taskId}
              style={{ ...kanbanTaskStyle, marginBottom: "15px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  margin: "6px",
                }}
              >
                <strong style={{ marginRight: "28px" }}>Tên:</strong>
                <span>{task.taskName}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  margin: "6px",
                }}
              >
                <strong style={{ marginRight: "30px" }}>Chi tiết:</strong>
                <span>{task.taskDesc}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  margin: "6px",
                }}
              >
                <strong style={{ marginRight: "8px" }}>Thời hạn:</strong>
                <span>
                  {new Date(task.taskDl).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              {/* Status */}
              <div style={{ margin: "6px" }}>
                <label htmlFor={`status-${task.taskId}`} style={{ marginRight: "24px" }}>
                  <strong >Status:</strong>
                </label>
                <select
                  id={`status-${task.taskId}`}
                  value={task.taskStatus}
                  onChange={(e) =>
                    handleStatusChange(task.taskId, e.target.value, columnId)
                  }
                  style={{ ...selectStyle, padding: "4px" }}
                >
                  <option value="to do" style={{ fontWeight: "bold" }}>
                    To Do
                  </option>
                  <option value="doing" style={{ fontWeight: "bold" }}>
                    Doing
                  </option>
                  <option value="done" style={{ fontWeight: "bold" }}>
                    Done
                  </option>
                </select>
              </div>
              {/* Assigned Team */}
              <div style={{ margin: "6px" }}>
                <label htmlFor={`team-${task.taskId}`} style={{ marginRight: "10px" }}>
                  <strong>Assigned:</strong>
                </label>
                <select
                  id={`team-${task.taskId}`}
                  value={task.teamId || ""}
                  onChange={(e) =>
                    handleAssignedTeamChange(task.taskId, e.target.value)
                  }
                  onFocus={() => fetchTeams(eventId, task.taskId)}
                  style={{ ...selectStyle, padding: "4px" }}
                  disabled={task.teamName}
                >
                  {task.teamName ? (
                    <option value={task.teamId} style={{ fontStyle: "italic" }}>
                      {task.teamName}
                    </option>
                  ) : (
                    <>
                      <option value="">Chọn team</option>
                      {teams.map((team) => (
                        <option
                          key={team.teamId}
                          value={team.teamId}
                          style={{ fontStyle: "italic" }}
                        >
                          {team.teamName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <button
                onClick={() => handleDelete(task.taskId, columnId)}
                style={{ ...deleteButtonStyle }}
              >
                Xóa
              </button>
            </div>
          ))}
          <button onClick={handleAddTask} style={{ ...addButtonStyle }}>
            Tạo công việc mới
          </button>
        </div>
      ))}{" "}
      {showDialog && (
        <AddTaskDialog
          onClose={() => setShowDialog(false)}
          onSave={handleSaveTask}
          eventId={eventId}
        />
      )}{" "}
    </div>
  );
};

const kanbanContainerStyle = {
  display: "flex",
  overflowX: "auto",
  padding: "20px",
  backgroundColor: "#f9f9f9",
};

const kanbanColumnStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "20px",
  maxHeight: "600px",
  overflowY: "auto",
  flex: 1,
  padding: "10px",
  boxSizing: "border-box",
};

const kanbanTaskStyle = {
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "5px",
  padding: "5px",
  fontSize: "14px",
  minHeight: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const addButtonStyle = {
  backgroundColor: "#1890ff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "6px 12px",
  cursor: "pointer",
  marginTop: "10px",
};

const deleteButtonStyle = {
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "6px 12px",
  cursor: "pointer",
  marginTop: "10px",
};

const selectStyle = {
  padding: "6px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
};

const dialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
};

const dialogContainerStyle = {
  backgroundColor: "#fff",
  width: "400px",
  margin: "100px auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const saveButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default KanbanBoard;
