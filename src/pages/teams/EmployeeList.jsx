import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

function EmployeeList({ teamId, employees, onTeamUpdate }) {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const manId = localStorage.getItem("userId")

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddMember = async (teamId, employeeId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/man/team/${teamId}/add/${employeeId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      if (response.data.data === true) {
        console.log(response.data.data);
        Swal.fire({
          title: "Add member",
          text: "Thêm thành viên thành công",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        setOpenDialog(false);
        onTeamUpdate();
      } else {
        Swal.fire({
          title: "Add member",
          text: "Thêm thành viên thất bại",
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
      if (response.status === "success") {
        Swal.fire({
          title: "Delete",
          text: "Xóa thành viên thành công",
          icon: "success",
          confirmButtonText: "OK",
          showClass: {
            popup: "animate__animated animate__fadeInDown" 
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp" 
          },
        });
        onTeamUpdate();
      } else {
        Swal.fire({
          title: "Delete",
          text: "Xóa thành viên thất bại",
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
      console.error("Error deleting member:", error);
      Swal.fire({
        title: "Delete",
        text: "Xóa thành viên thất bại",
        icon: "error",
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

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/man/employee/${manId}/member/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
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
        await fetchMembers();
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    };
    loadMembers();
  }, []);

  const handleOpenDialog = async () => {
    try {
      await fetchMembers();
      setOpenDialog(true);
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            onClick={handleOpenDialog}
            style={{
              backgroundColor: "#3f51b5",
              color: "#ffffff",
             
              padding: "8px 16px",
            }}
          >
            Thêm thành viên
          </Button>
        </Box>

        <Table sx={{ marginTop: "5px" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#80A8FF' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteMember(teamId, employee.id)}
                  >
                    <DeleteOutlineOutlinedIcon />
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
          <Typography>Team ID: {teamId}</Typography>
          <Box mt={2}>
            {members.map((member) => (
              <Box
                key={member.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{member.fullName}</Typography>
                <IconButton
                  color="primary"
                  onClick={() => handleAddMember(teamId, member.id)}
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

export default EmployeeList;
