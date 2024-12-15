import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { useLocation, useNavigate ,useParams} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {
  fetchTasks,
  updateTask,
  deleteTask,
  createTask,
  getTeamsForTask,
  assignedTeam,
} from "../../routes/route";
const KanbanBoardEmployee = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { employeeId, taskIds } = location.state || {};
    
    const [columns, setColumns] = useState({
      "to do": [],
      doing: [],
      done: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchSubtasks = async () => {
          try {
            setLoading(true);
            
            // Lọc đi các giá trị trùng lặp trong taskIds
            const uniqueTaskIds = Array.from(new Set(taskIds));
      
            if (uniqueTaskIds.length > 0) {
              const fetchPromises = uniqueTaskIds.map((taskId) =>
                axios.get(`http://localhost:8080/emp/${employeeId}/subtask/${taskId}`, {
                  headers: { Authorization: localStorage.getItem("token") },
                })
              );
      
              const responses = await Promise.all(fetchPromises);
              const fetchedSubtasks = responses.reduce((acc, response) => {
                if (response.data && response.data.statusCode === 0) {
                  return [...acc, ...response.data.data];
                }
                return acc;
              }, []);
      
              setColumns({
                "to do": fetchedSubtasks.filter((task) => task.status === "to do"),
                doing: fetchedSubtasks.filter((task) => task.status === "doing"),
                done: fetchedSubtasks.filter((task) => task.status === "done"),
              });
            } else {
              setError("No tasks found.");
            }
          } catch (err) {
            setError("Error fetching data: " + err.message);
          } finally {
            setLoading(false);
          }
        };
      
        fetchSubtasks();
      }, [employeeId, taskIds]); 
      
  
    const updateSubtasks = async (subtasksToUpdate) => {
      try {
        const promises = subtasksToUpdate.map((subtask) =>
          axios.put(
            `http://localhost:8080/emp/${subtask.taskId}`, 
            {
              subTaskId: subtask.subTaskId,
              subTaskName: subtask.subTaskName,
              subTaskDesc: subtask.subTaskDesc,
              subTaskDeadline: subtask.subTaskDeadline,
              subTaskStart: subtask.subTaskStart,
              status: subtask.status,
              employeeId: subtask.employeeId,
              taskId: subtask.taskId,
            },
            { headers: { Authorization: localStorage.getItem("token") } }
          )
        );
  
        await Promise.all(promises);
      } catch (err) {
        console.error("Failed to update subtasks:", err);
      }
    };
  
    const handleDragEnd = async (result) => {
      if (!result.destination) return;
  
      const { source, destination } = result;
  
      if (source.droppableId !== destination.droppableId) {
        // Di chuyển giữa các cột
        const sourceColumn = [...columns[source.droppableId]];
        const destColumn = [...columns[destination.droppableId]];
        const [removed] = sourceColumn.splice(source.index, 1);
  
        if (["to do", "doing", "done"].includes(removed.status)) {
          removed.status = destination.droppableId;
          destColumn.splice(destination.index, 0, removed);
  
          setColumns({
            ...columns,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
          });
  
          // Cập nhật tất cả các subtask có trạng thái đã thay đổi
          await updateSubtasks([removed]);
         
        }
      } else {
        // Di chuyển trong cùng cột
        const column = [...columns[source.droppableId]];
        const [removed] = column.splice(source.index, 1);
  
        if (["to do", "doing", "done"].includes(removed.status)) {
          removed.status = source.droppableId;
          column.splice(destination.index, 0, removed);
  
          setColumns({
            ...columns,
            [source.droppableId]: column,
          });
  
          // Cập nhật tất cả các subtask có trạng thái đã thay đổi
          await updateSubtasks(column);
        }
      }
    };
    const handleNavigateToCalendar = () => {
        
        if (taskIds && taskIds.length > 0) {
          navigate(`/events/${eventId}/calendar`, { state: { taskIds } });
        } else {
          console.error("No tasks to navigate.");
        }
      };
      
    if (loading) {
      return <CircularProgress />;
    }
  
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }
  

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ marginRight: 2 }}>
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
          }}
        >
          Kanban Board
        </Typography>
        <IconButton
  aria-label="assign"
  onClick={handleNavigateToCalendar}
>
  <CalendarMonthOutlinedIcon />
</IconButton>

      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {Object.keys(columns).map((columnKey) => (
            <Grid item xs={12} sm={6} md={4} key={columnKey}>
              <Paper
                elevation={6}
                sx={{
                  padding: 3,
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#424242",
                  }}
                >
                  {columnKey.toUpperCase()}
                </Typography>
                <Droppable droppableId={columnKey}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 400,
                        padding: 3,
                        borderRadius: 3,
                        backgroundColor:
                          columnKey === "Drop" ? "#ffebee" : "#e3f2fd",
                        overflowY: "auto",
                        marginBottom: 2,
                        border:
                          columnKey === "Drop" ? "none" : "1px dashed #cfd8dc",
                      }}
                    >
                      {columns[columnKey].map((task, index) => (
                        <Draggable
                          key={task.subTaskId}
                          draggableId={task.subTaskId.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                marginBottom: 2,
                                borderRadius: 2,
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                            >
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#1976d2",
                                  }}
                                >
                                  {task.subTaskName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    marginBottom: 1,
                                  }}
                                >
                                  {task.subTaskDesc}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#388e3c",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Deadline:{" "}
                                  {new Date(
                                    task.subTaskDeadline
                                  ).toLocaleString()}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#d32f2f",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Start:{" "}
                                  {new Date(task.subTaskStart).toLocaleString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoardEmployee;
