import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Collapse, Box, Tooltip } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { useParams } from "react-router-dom";

const EmployeeTable = () => {
    const { eventId } = useParams();
    const employeeId = localStorage.getItem("userId");
    const [employees, setEmployees] = useState([]);
    const [teamInfo, setTeamInfo] = useState({ teamId: '', teamName: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/emp/${employeeId}/team/${eventId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                const data = response.data.data;
                if (data.length > 0) {
                    setTeamInfo({ teamId: data[0].teamId, teamName: data[0].teamName });
                }
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, [eventId, employeeId]);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
                Team ID: {teamInfo.teamId} - Team Name: {teamInfo.teamName}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <EmployeeRow key={employee.id} employee={employee} userId={employeeId} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const EmployeeRow = ({ employee, userId }) => {
    const [open, setOpen] = useState(false);
    const isCurrentUser = employee.id.toString() === userId;

    return (
        <>
            <TableRow>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                    <Tooltip title={isCurrentUser ? "Đi đến bảng công việc của bạn" : ""}>
                        <IconButton
                            aria-label="assign"
                            style={{ color: isCurrentUser ? 'red' : 'inherit' }}
                        >
                            <AssignmentOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Subtasks
                            </Typography>
                            <Table size="small" aria-label="subtasks">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SubTask ID</TableCell>
                                        <TableCell>SubTask Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell>Start</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employee.listSubTasks.map((subTask) => (
                                        <TableRow key={subTask.subTaskId}>
                                            <TableCell>{subTask.subTaskId}</TableCell>
                                            <TableCell>{subTask.subTaskName}</TableCell>
                                            <TableCell>{subTask.subTaskDesc}</TableCell>
                                            <TableCell>{subTask.subTaskDeadline}</TableCell>
                                            <TableCell>{subTask.subTaskStart}</TableCell>
                                            <TableCell>{subTask.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {employee.listSubTasks.length === 0 && (
                                <Typography variant="body2" color="textSecondary">
                                    No subtasks available.
                                </Typography>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default EmployeeTable;
