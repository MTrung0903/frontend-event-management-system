import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, IconButton, Tooltip, Collapse, Box, CardActions, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
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
        <div>
            <Typography variant="h5" component="div" sx={{ p: 2 }}>
                Team ID: {teamInfo.teamId} - Team Name: {teamInfo.teamName}
            </Typography>
            <Grid container spacing={3}>
                {employees.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} userId={employeeId} />
                ))}
            </Grid>
        </div>
    );
};

const EmployeeCard = ({ employee, userId }) => {
    const [open, setOpen] = useState(false);
    const isCurrentUser = employee.id.toString() === userId;

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        {employee.fullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        ID: {employee.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Address: {employee.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Email: {employee.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Phone: {employee.phone}
                    </Typography>
                </CardContent>
                <CardActions>
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
                </CardActions>
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
            </Card>
        </Grid>
    );
};

export default EmployeeTable;
