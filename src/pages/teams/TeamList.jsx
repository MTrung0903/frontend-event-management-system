import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tabs,
  Tab,
  Box,


} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import EmployeeList from "./EmployeeList";
import { useParams } from "react-router-dom";
import TaskList from "./TaskList"
import Header from "../../components/Header";

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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
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
    <>
    <Header title="CHI TIẾT NHÓM"/>
      {teams.map((team) => (
        <Accordion key={team.teamId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Team: ${team.teamName}`}</Typography>
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
    </>
  );
}

export default TeamList;