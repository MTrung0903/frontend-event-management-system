import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Contacts = () => {
  const { eventId } = useParams();
  const colors = tokens("light");
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogCreateTeam, setOpenDialogCreateTeam] = useState(false);

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
  const handleDelete = async (teamId) => {
    try {
      setLoading(true);
      const response = await deleteTeam(teamId);
      if (response.statusCode === 0) {
        alert("Team deleted successfully!");
        const teamsData = await fetchTeams(eventId);
        setTeams(teamsData);
      } else {
        alert("Failed to delete team.");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMember = async (teamId, employeeId) => {
    try {
      setLoading(true);
      const response = await deleteTeamMember(teamId, employeeId);
      if (response.statusCode === 0) {
        alert("Member deleted successfully!");
        const teamsData = await fetchTeams(eventId);
        setTeams(teamsData);
      } else {
        alert("Failed to delete team.");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
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

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:8080/man/employee/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();

      if (result.statusCode === 0 && result.data) {
        return result.data;
      } else {
        throw new Error("Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setError(null); 
        const teamsData = await fetchTeams(eventId);
        setTeams(teamsData);
      } catch (err) {
        setError("Failed to load teams.");
      }
    };

    if (eventId) {
      loadTeams();
    }
  }, [eventId]);


  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    };

    loadEmployees();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSearchTerm("");
  };

  const handleOpenDialog = () => {
    fetchEmployees();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialogCreateTeam = () => {
    setOpenDialogCreateTeam(false);
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
        setOpenDialog(false); 

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

  if (loading) {
    return (
      <Box m="20px" textAlign="center">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px" textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="TEAMS" subtitle="Danh sách nhóm và nhân viên" />

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

      {teams.length === 0 ? (
        <Box textAlign="center" m="20px">
          <Typography>Không có team khả dụng.</Typography>
        </Box>
      ) : (
        <>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {teams.map((team, index) => (
              <Tab key={team.teamId} label={team.teamName} />
            ))}
          </Tabs>

          {teams.map((team, index) =>
            index === selectedTab ? (
              <Box key={team.teamId} mt="20px">
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleOpenDialog}
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "#ffffff",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    marginLeft:"1010px"
                  }}
                >
                  Thêm thành viên nhóm
                </Button>

                <TextField
                  label="Tìm kiếm nhân viên"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Box
                  height="400px"
                  sx={{
                    "& .MuiDataGrid-root": {
                      border: "none",
                      color: colors.primary[100],
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.blueAccent[700],
                      borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: colors.blueAccent[700],
                    },
                  }}
                >
                  <DataGrid
                    rows={team.listEmployees.map((employee) => ({
                      id: employee.id,
                      fullName: employee.fullName,
                      email: employee.email,
                      phone: employee.phone,
                      address: employee.address,
                    }))}
                    columns={[
                      { field: "id", headerName: "ID", flex: 0.5 },
                      { field: "fullName", headerName: "Tên", flex: 1 },
                      { field: "email", headerName: "Email", flex: 1 },
                      { field: "phone", headerName: "SĐT", flex: 1 },
                      { field: "address", headerName: "Địa chỉ", flex: 1 },
                      {
                        field: "action",
                        headerName: "Action",
                        flex: 1,
                        renderCell: (params) => (
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteMember(
                                teams[selectedTab]?.teamId,
                                params.row.id
                              )
                            }
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        ),
                      },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => handleDelete(teams[selectedTab]?.teamId)}
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "#ffffff",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    marginTop: "10px",
                    marginLeft:"1010px"
                  }}
                >
                  Xóa nhóm
                </Button>
              </Box>
            ) : null
          )}
        </>
      )}

      {/* Dialog thêm thành viên */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thêm thành viên vào team</DialogTitle>
        <DialogContent>
          <Typography>Mã nhóm: {teams[selectedTab]?.teamId}</Typography>
          <Box mt={2}>
            {employees.map((employee) => (
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
            Thoát
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo team */}
      <Dialog
        open={openDialogCreateTeam}
        onClose={handleCloseDialogCreateTeam}
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
          <Button onClick={handleCloseDialogCreateTeam} color="secondary">
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

export default Contacts;
