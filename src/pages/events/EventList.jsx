import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Card, CardContent, Typography, CardMedia, Grid, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close'
import './event.css'
const EventList = ({ setSelectedEvent }) => {
    console.log(setSelectedEvent);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState({});
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(value, filterStatus); 
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setFilterStatus(status);
        applyFilters(searchTerm, status); 
    };

    const applyFilters = (term, status) => {
        let filtered = events;

        
        if (term) {
            filtered = filtered.filter((event) =>
                event.eventName.toLowerCase().includes(term.toLowerCase())
            );
        }

        
        if (status !== "All") {
            filtered = filtered.filter((event) => event.eventStatus === status);
        }

        setFilteredEvents(filtered);
    };
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
    const token = localStorage.getItem("token");
    const fetchEvents = () => {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles = payload.roles || [];
            const userId = payload.userId || null;
            if (userId) {
                localStorage.setItem("userId", userId);
              }
            if (roles.some((role) => ["ROLE_MANAGER", "ROLE_ADMIN"].includes(role))) {
                axios
                    .get(`http://localhost:8080/man/event/list-event/${userId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    })
                    .then((response) => {
                        if (response.data.statusCode === 0) {
                            setEvents(response.data.data);
                            setFilteredEvents(response.data.data);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data", error);
                    });
            } else {
                axios
                    .get(`http://localhost:8080/emp/event/${userId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    })
                    .then((response) => {
                        if (response.data.statusCode === 0) {
                            setEvents(response.data.data);
                            setFilteredEvents(response.data.data);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data", error);
                    });
            }
        }
    };
    useEffect(() => {
        fetchEvents();
    }, []);
    
    useEffect(() => {
        const fetchImages = async () => {
            const urls = {};
            for (const event of events) {
                if (event.eventImg) {
                    try {
                        const response = await axios.get(`http://localhost:8080/file/${event.eventImg}`, {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                            responseType: 'blob',
                        });
                        urls[event.eventId] = URL.createObjectURL(response.data);
                    } catch {
                        urls[event.eventId] = defaultImage;
                    }
                } else {
                    urls[event.eventId] = defaultImage;
                }
            }
            setImageUrls(urls);
        };

        if (events.length > 0) fetchImages();
    }, [events]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        navigate(`/events/${event.eventId}`);
    };
    const handleClickCreate = () => {
        navigate("/event/create");
    };
    const handleCancelDelete = () => {
        setConfirmOpen(false); 
    };
    const handleDelete = async () => {
        setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/man/event/${selected.eventId}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            
            fetchEvents();
            alert("Xóa sự kiện thành công!");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Xóa thất bại. Thử lại sau");
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <Box sx={{ padding: 2}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" >
                <TextField
                    placeholder="Tìm kiếm sự kiện"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{
                        width: "300px",
                        "& .MuiInputBase-root": {
                            height: "45px",
                        },
                        "& .MuiInputLabel-root": {
                            lineHeight: "45px",
                        },
                        
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px", 
                    }}
                >
                    <FormControl fullWidth style={{ minWidth: "150px" }}>
                        <Select onChange={handleStatusChange} value={filterStatus} style={{ height: "45px", lineHeight: "45px" }}>
                            <MenuItem value="All">Tất cả</MenuItem>
                            <MenuItem value="Incoming">Sắp diễn ra</MenuItem>
                            <MenuItem value="Draft">Bản nháp</MenuItem>
                            <MenuItem value="Completed">Hoàn thành</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleClickCreate}
                        sx={{
                            backgroundColor: "#1c7de8",
                            color: "white",
                            "&:hover": { backgroundColor: "#1565c0" },
                            minWidth: 150,
                            minHeight: 45
                        }}
                    >
                        Tạo sự kiện
                    </Button>
                </div>

            </Box>
            <Grid container spacing={4} sx={{ marginTop: '0px' }}>
                {filteredEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                        <Card
                            onClick={() => handleEventClick(event)}
                            sx={{
                                width: '380px',  
                                height: '350px', 
                                margin: 'auto',  
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)', 
                                },
                                position: 'relative',
                                paddingLeft:'8px',
                                paddingRight:'8px',
                                paddingTop:'4px'

                            }}
                        >
                            {/* Event Image */}
                            <CardMedia
                                component="img"
                                height="180"
                                image={imageUrls[event.eventId] || defaultImage}
                                alt={`${event.eventName}'s avatar`}
                                sx={{
                                    borderRadius: '4px', 
                                    overflow: 'hidden',
                                }}
                              
                            />

                            {/* Nội dung */}
                            <CardContent>
                                {/* Event Name */}
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {event.eventName}
                                </Typography>

                                {/* Event Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: '12px',
                                        fontStyle: 'italic',
                                        marginBottom: '12px',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        WebkitLineClamp: 2, // Hiển thị tối đa 2 dòng
                                    }}
                                >
                                    {event.eventDescription}
                                </Typography>

                                {/* Event Location */}
                                <Box display="flex" alignItems="center" mb={1}>
                                    <PlaceOutlined sx={{ fontSize: 18, marginRight: 1 }} />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: '12px',}}
                                    >
                                        <strong>Địa điểm:</strong> {event.eventLocation}
                                    </Typography>
                                </Box>

                              
                            </CardContent>

                            {/* Option Buttons */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    display: 'flex',
                                    gap: '8px',
                                }}
                            >


                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn click vào Card
                                        handleDelete(); // Hàm xử lý xóa
                                        setSelected(event);
                                    }}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <DeleteOutlined sx={{ fontSize: 20, color: '#d32f2f' }} />
                                </button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={confirmOpen}
                onClose={handleCancelDelete}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2,
                        width: "500px",
                        bgcolor: "#f9f9f9",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <DialogTitle
                    id="confirm-dialog-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        fontWeight: "bold",
                        color: "#333",
                        fontSize: "20px",
                        marginBottom: 1,
                    }}
                >
                    <WarningAmberIcon sx={{ color: "#f57c00", fontSize: 28 }} />
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent

                >
                    <DialogContentText
                        id="confirm-dialog-description"
                        sx={{
                            textAlign: "center",
                            color: "#555",
                            fontSize: "16px",
                            marginBottom: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}
                    >
                        Bạn có chắc chắn muốn xóa sự kiện này? <br />
                        <strong>Hành động này không thể hoàn tác.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: "center",
                        gap: 2,
                        paddingBottom: 2,
                    }}
                >
                    <Button
                        onClick={handleCancelDelete}
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        sx={{
                            color: "#333",
                            borderColor: "#bbb",
                            "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "#f2f2f2",
                            },
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        startIcon={<WarningAmberIcon />}
                        sx={{
                            backgroundColor: "#e53935",
                            color: "white",
                            "&:hover": { backgroundColor: "#d32f2f" },
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


export default EventList;
