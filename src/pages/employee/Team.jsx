import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Collapse, Box, Tooltip } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { useNavigate, useParams } from "react-router-dom";

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
        <div style={{marginLeft:'10px'}}>
            <Typography variant="h3" component="div" sx={{ p: 2, marginLeft:'10px' }}>
                Team ID: {teamInfo.teamId} - Team Name: {teamInfo.teamName}
            </Typography>
             <TableContainer component={Paper} sx={{ marginLeft:'20px',marginTop:'10px', width:'96%'}}>
            
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#80A8FF' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Full Name</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Address</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Phone</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {employees.map((employee) => (
                        <EmployeeRow key={employee.id} employee={employee} userId={employeeId} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
       
    );
};

const EmployeeRow = ({ employee, userId }) => {
    const { eventId } = useParams();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const isCurrentUser = employee.id.toString() === userId;

    const handleKanbanRedirect = () => {
        if (employee.listSubTasks && employee.listSubTasks.length > 0) {
           
            const taskIds = employee.listSubTasks.map(subTask => subTask.taskId); 
            navigate(`/events/${eventId}/subtask`, { state: { employeeId: employee.id, taskIds } });
        } else {
            console.warn("No taskId available for this employee");
        }
    };
    

    return (
        <>
            <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                    <Tooltip title={isCurrentUser ? "Đi đến bảng công việc của bạn" : ""}>
                        <IconButton
                            aria-label="assign"
                            style={{ color: isCurrentUser ? '#80A8FF' : 'inherit' }}
                            onClick={isCurrentUser ? handleKanbanRedirect : undefined}
                            disabled={!isCurrentUser}
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
                            <Typography variant="h6" gutterBottom component="div" sx={{ marginLeft: 2, marginRight: 2, paddingBottom: '10px' }}> 
                                Subtasks
                            </Typography>
                            <Box sx={{ marginLeft: 2, marginRight: 2 }}>
                                <Table
                                    size="small"
                                    aria-label="subtasks"
                                    sx={{
                                        border: 'none',
                                        '& .MuiTableCell-root': { borderBottom: 'none' },
                                    }}
                                >
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#80A8FF' }}>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                SubTask ID
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                SubTask Name
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Description
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Deadline
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Start
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employee.listSubTasks.map((subTask) => (
                                            <TableRow key={subTask.subTaskId}>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.subTaskId}</TableCell>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.subTaskName}</TableCell>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.subTaskDesc}</TableCell>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.subTaskDeadline}</TableCell>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.subTaskStart}</TableCell>
                                                <TableCell sx={{ padding: '20px' }}>{subTask.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
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
