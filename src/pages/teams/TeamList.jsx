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
  TextField,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
  const [tabValues, setTabValues] = useState({});

  const handleChange = (teamId, event, newValue) => {
    setTabValues((prev) => ({
      ...prev,
      [teamId]: newValue, 
    }));
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
          text: "Tạo nhóm thành công",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        const teams = await fetchData();
        setTeams(teams);
        setOpenDialogCreateTeam(false);
        setDataTeam({ teamName: "", eventId: "" });
      } else {
       
        Swal.fire({
          title: "Create team",
          text: "Tạo nhóm thất bại",
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
      console.error("Error creating team:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred.",
        icon: "failed",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
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

  const deleteTeam = async (teamId) => {
    const response = await axios.delete(
      `http://localhost:8080/man/team/${teamId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };
  const handleDelete = async (teamId) => {
    try {
      setLoading(true);
      const { isConfirmed } = await Swal.fire({
        title:'Delete',
        text: 'Bạn có chắc chắn muốn xóa team. Lưu ý : hành động không thể hoàn tác',
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

      const response = await deleteTeam(teamId);
      if (response.data) {
        Swal.fire({
          title: "Delete",
          text: "Xóa team thành công!",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
          
        });
        const teams = await fetchData();
        setTeams(teams);
        setOpenDialogCreateTeam(false);
        
      } else {
       
        Swal.fire({
          title: "Xóa thất bại",
          text: "Không thể xóa các team đã hoàn thành công việc",
          icon: "warning",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error creating team:", error);

      Swal.fire({
        title: "Error",
        text: "Xóa thất bại , hãy kiểm tra lại",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
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
          <Typography sx={{fontSize:"22px"}}>{`Nhóm: ${team.teamName}`}</Typography>
          <IconButton onClick={() =>
                    handleDelete(team.teamId)
                  }>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
          </AccordionSummary>
      
          <AccordionDetails>
          <Tabs
            value={tabValues[team.teamId] || 0} 
            onChange={(event, newValue) => handleChange(team.teamId, event, newValue)} 
          >
            <Tab label="Nhân viên" />
            <Tab label="Công việc" />
          </Tabs>
          <TabPanel value={tabValues[team.teamId] || 0} index={0}>
            <EmployeeList employees={team.listEmployees || []} teamId={team.teamId} onTeamUpdate={handleTeamUpdate} />
          </TabPanel>
          <TabPanel value={tabValues[team.teamId] || 0} index={1}>
            <TaskList tasks={team.listTasks || []} teamId={team.teamId} setTasks={handleTeamUpdate} />
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