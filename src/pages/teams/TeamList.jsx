import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import EmployeeList from "./EmployeeList";
import { useParams } from "react-router-dom";
import TaskList from "./TaskList"
import Header from "../../components/Header";
import Swal from "sweetalert2";

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



function TeamList() {
  const { eventId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialogCreateTeam, setOpenDialogCreateTeam] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [dataTeam, setDataTeam] = useState({
    teamName: "",
    eventId: "",
  });
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
      return response.data.data;
    } catch (err) {
      throw new Error("Failed to fetch team data");
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await createTeam({ ...dataTeam, eventId });
      if (response.statusCode === 0) {

        Swal.fire({
          title: "Create team",
          text: "Team created successfully!",
          icon: "success",
          confirmButtonText: "OK"
        });
        const teams = await fetchData();
        setTeams(teams);
        setOpenDialogCreateTeam(false);
        setDataTeam({ teamName: "", eventId: "" });
      } else {
       
        Swal.fire({
          title: "Create team",
          text: "Failed to create team.",
          icon: "failed",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error creating team:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred.",
        icon: "failed",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTeamUpdate = async () => {
    try {
      const detailTeam = await fetchData();
      setTeams(detailTeam);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const detailTeam = await fetchData();
        setTeams(detailTeam);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [eventId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{`Error: ${error}`}</Typography>;
  }

  return (
    <div style={{marginLeft:"10px", marginRight:"5px"}}>
    <Header title="CHI TIẾT NHÓM"/>
    <Button
        type="submit"
        variant="contained"
        onClick={() => setOpenDialogCreateTeam(true)}
        style={{
          backgroundColor: "#3f51b5",
          color: "#ffffff",
         
          padding: "8px 16px",
          marginBottom:"10px",
          marginLeft:"10px",

        }}
      >
        Add Team
      </Button>
      {teams.map((team) => (
        <Accordion key={team.teamId} defaultExpanded={true} sx={{ boxShadow: 'none', marginLeft:'10px' }} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{fontSize:"22px"}}>{`Team: ${team.teamName}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab label="Nhân viên" />
              <Tab label="Công việc" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <EmployeeList employees={team.listEmployees || []} teamId={team.teamId} onTeamUpdate={handleTeamUpdate} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TaskList tasks={team.listTasks || []} teamId={team.teamId} setTasks={handleTeamUpdate}/>
            </TabPanel>
          </AccordionDetails>
        </Accordion>
      ))}
            {/* Dialog tạo team */}
            <Dialog
        open={openDialogCreateTeam}
        onClose={() => setOpenDialogCreateTeam(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thêm team</DialogTitle>
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
          <Button onClick={() => setOpenDialogCreateTeam(false)} color="secondary">
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
    </div>
  );
}

export default TeamList;