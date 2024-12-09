import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function EmployeeList({ employees }) {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  
  const handleOpenDialog = () => {
    fetchMembers();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddMember = async (teamId, employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/man/team/${teamId}/add/${employeeId}`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        alert("Member added successfully!");
        setOpenDialog(false); // Close dialog
        // Fetch lại dữ liệu team
        const updatedTeams = await fetch(
          `http://localhost:8080/man/event/${eventId}/team-member`,
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const result = await updatedTeams.json();
        if (result.statusCode === 0 && result.data) {
          setTeams(result.data);
        }
      } else {
        alert("Failed to add member!");
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const deleteTeamMember = async (teamId, employeeId) => {
    const response = await axios.delete(
      `http://localhost:8080/man/team/${teamId}/del/${employeeId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };

  const handleDeleteMember = async (teamId, employeeId) => {
    try {
      setLoading(true);
      const response = await deleteTeamMember(teamId, employeeId);
      if (response.statusCode === 0) {
        alert("Member deleted successfully!");
        // Fetch lại dữ liệu team
        const updatedTeams = await fetch(
          `http://localhost:8080/man/event/${eventId}/team-member`,
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const result = await updatedTeams.json();
        if (result.statusCode === 0 && result.data) {
          setTeams(result.data);
        }
      } else {
        alert("Failed to delete member.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/man/employee", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      if (result.statusCode === 0 && result.data) {
        setMembers(result.data);
      } else {
        throw new Error("Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const memberData = await fetchMembers();
        setMembers(memberData);
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    };
    loadMembers();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleOpenDialog}
          style={{
            backgroundColor: "#3f51b5",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "8px 16px",
            marginLeft: "1010px",
          }}
        >
          Add Member
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteMember(teams[selectedTab]?.teamId, employee.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Dialog thêm thành viên */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Member to Team</DialogTitle>
        <DialogContent>
          <Typography>Team ID: {teams[selectedTab]?.teamId}</Typography>
          <Box mt={2}>
            {members.map((employee) => (
              <Box
                key={employee.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{employee.fullName}</Typography>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddMember(teams[selectedTab]?.teamId, employee.id)
                  }
                >
                  <AddOutlinedIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SubTaskList({ subTasks }) {
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
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TaskList({ tasks }) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleExpandClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
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
                  <IconButton>
                    <DeleteIcon />
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
                    <SubTaskList subTasks={task.listSubTasks || []} />
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TeamList() {
  const { eventId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const [dataTeam, setDataTeam] = useState({
    teamName: "",
    eventId: "",
  });

  const [openDialogCreateTeam, setOpenDialogCreateTeam] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchTeams = async (eventId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/man/event/${eventId}/team-member`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();

      if (result.statusCode === 0 && result.data) {
        return result.data;
      } else {
        throw new Error("Failed to fetch team members.");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const createTeam = async (dataTeam) => {
    const response = await axios.post(
      `http://localhost:8080/man/team`,
      dataTeam,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };

  const deleteTask = async (taskId) => {
    const response = await axios.delete(
      `http://localhost:8080/man/task/${taskId}`,

      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };
  const deleteSubtask = async (subtaskId) => {
    const response = await axios.delete(
      `http://localhost:8080/man/subtask/${subtaskId}`,

      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await createTeam({ ...dataTeam, eventId });
      if (response.statusCode === 0) {
        alert("Team created successfully!");
        const teamsData = await fetchTeams(eventId);
        setTeams(teamsData);
        setOpenDialogCreateTeam(false);
        setDataTeam({ teamName: "", eventId: "" });
      } else {
        alert("Failed to create team.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const handleCloseDialogCreateTeam = () => {
    setOpenDialogCreateTeam(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/team/${eventId}/detail`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("API Response Data:", response.data.data);
      return response.data.data;
    } catch (err) {
      throw new Error("Failed to fetch team data");
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const detailTeam = await fetchData();
        setTeams(detailTeam);
        console.log("Teams after API call:", detailTeam);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{`Error: ${error}`}</Typography>;
  }

  return (
    <>
      <Button
        type="submit"
        variant="contained"
        onClick={() => setOpenDialogCreateTeam(true)}
        style={{
          backgroundColor: "#3f51b5",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "8px 16px",
        }}
      >
        Add Team
      </Button>
      {teams.map((team) => (
        <Accordion key={team.teamId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Team: ${team.teamName}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab label="Employees" />
              <Tab label="Tasks" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <EmployeeList employees={team.listEmployees || []} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TaskList tasks={team.listTasks || []} />
            </TabPanel>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Dialog tạo team */}
      <Dialog
        open={openDialogCreateTeam}
        onClose={handleCloseDialogCreateTeam}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Team</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Team Name"
            name="teamName"
            value={dataTeam.teamName}
            onChange={(e) =>
              setDataTeam({ ...dataTeam, teamName: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogCreateTeam} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TeamList;
