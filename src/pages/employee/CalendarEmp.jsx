import { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";
import { useLocation, useNavigate ,useParams} from "react-router-dom";
const CalendarEmp = () => {
    const location = useLocation();
    const { taskIds } = location.state || {};

const uniqueTaskIds = [...new Set(taskIds)];
    console.log(taskIds)
  const employeeId = localStorage.getItem("userId");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  useEffect(() => {
    const fetchSubtasks = async () => {
        try {
            const allSubtasks = [];
            console.log(taskIds)
            for (const taskId of uniqueTaskIds) {
                const response = await axios.get(
                    `http://localhost:8080/emp/${employeeId}/subtask/${taskId}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                
                if (response.data && response.data.statusCode === 0) {
                    allSubtasks.push(...response.data.data);
                } else {
                    console.error(`Failed to fetch subtasks for taskId: ${taskId}`, response.data.message);
                }
            }

            // Định dạng dữ liệu sau khi đã lấy tất cả subtasks
            const formattedEvents = allSubtasks.map((subtask) => ({
                id: subtask.subTaskId,
                title: subtask.subTaskName,
                start: subtask.subTaskDeadline,
            }));

            setCurrentEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching subtasks:", error);
        }
    };

    if (uniqueTaskIds && uniqueTaskIds.length > 0) {
        fetchSubtasks();
    }
}, [employeeId, uniqueTaskIds]);


  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                  sx={{ overflowWrap: "break-word" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={currentEvents.map((event) => ({
              ...event,
              title: truncateTitle(event.title, 20),
            }))}
            eventContent={(eventInfo) => {
              return (
                <>
                  <div
                    style={{
                      display: "-webkit-box",
                      "-webkit-line-clamp": "2",
                      "-webkit-box-orient": "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {eventInfo.event.title}
                  </div>
                </>
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarEmp;
