import React, { useEffect, useState } from "react";
import axios from "axios";
import {  Card, CardContent, Typography, CardMedia, Grid, Box, TextField,  FormControl, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";


import PlaceOutlined from '@mui/icons-material/PlaceOutlined';


const EventListEmp = ({ setSelectedEvent }) => {
    console.log(setSelectedEvent);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState({});
    const token = localStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = events.filter((event) =>
            event.eventName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEvents(filtered);
    };
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
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
        navigate(`/events/${event.eventId}/team-detail`);
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
                        <Select defaultValue={"All"} style={{ height: "45px", lineHeight: "45px" }}>
                            <MenuItem value="All">Tất cả</MenuItem>
                            <MenuItem value="Incoming">Sắp diễn ra</MenuItem>
                            <MenuItem value="Draft">Bản nháp</MenuItem>
                            <MenuItem value="Completed">Hoàn thành</MenuItem>
                        </Select>
                    </FormControl>
                   
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


                             
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
};


export default EventListEmp;