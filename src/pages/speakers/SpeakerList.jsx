import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, IconButton,  Menu, MenuItem, Avatar,Grid, TextField} from '@mui/material';
import { Link } from "react-router-dom";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SpeakerAdd from './SpeakerAdd';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/man/speaker', 
    headers: {
        Authorization: localStorage.getItem("token"),
    },
  });
const SpeakerList = () => {
    const [speakers, setSpeakers] = useState([]);
    const [filteredSpeakers, setFilteredSpeakers] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSpeakerId, setSelectedSpeaker] = useState(null);
    const [imageUrls, setImageUrls] = useState({});  
    const [searchTerm, setSearchTerm] = useState("");

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = speakers.filter((speaker) =>
            speaker.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSpeakers(filtered);
    };
    // Fetch data from API
    useEffect(() => {
        fetch('http://localhost:8080/man/speaker', {
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('API Response:', result);
                if (Array.isArray(result.data)) {
                    setSpeakers(result.data);
                    setFilteredSpeakers(result.data);
                } else {
                    console.error('Unexpected API response format:', result);
                    setSpeakers([]);
                }
            })
            .catch((error) => console.error('Error fetching speakers:', error));
    }, []);

    // Handle dots menu
    const handleMenuOpen = (event, speakerId) => {
        setAnchorEl(event.currentTarget);
        setSelectedSpeaker(speakerId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSpeaker(null);
    };

    // const handleViewDetail = () => {
    //     console.log('Edit speaker:', selectedSpeakerId);
    //     handleMenuClose();
    //     navigate(`/speakers/${selectedSpeakerId.id}`);
    // };

    const handleDelete = async () => {
        try {
          await axiosInstance.delete(`/${selectedSpeakerId}`);
          alert("Sponsor deleted successfully");
      
          const response = await axiosInstance.get();
          setSpeakers(response.data.data || []);
         
        } catch (error) {
          console.error("Error deleting sponsor:", error);
          alert("Failed to delete sponsor. Please try again later.");
        } finally {
        }
        handleMenuClose(); // Đóng menu khi hoàn thành thao tác
      };

    // Fetch image with authentication headers
    const fetchImage = async (image) => {
        try {
            const response = await fetch(`http://localhost:8080/file/${image}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageUrls((prevState) => ({ ...prevState, [image]: imageUrl }));
            } else {
                console.error('Failed to fetch image');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    useEffect(() => {
        speakers.forEach((speaker) => {
            fetchImage(speaker.image);
            console.log(speaker.image) // Fetch image for each speaker
        });
    }, [speakers]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                variant="h4"
                style={{ fontWeight: "bold", color: "#333", textAlign: "left", marginBottom: "20px" }}
            >
                Danh sách diễn giả
            </Typography>
            <Box display="flex" justifyContent="space-between" marginBottom="20px">
                <TextField
                    label="Search Speaker"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: "300px" }}
                />
                <SpeakerAdd
                    onAdd={(newSpeaker) => {
                        setSpeakers((prev) => [...prev, newSpeaker]);
                        setFilteredSpeakers((prev) => [...prev, newSpeaker]);
                    }}
                />
            </Box>
            <Grid container spacing={2}>
                {filteredSpeakers.map((speaker) => (
                    <Grid item xs={12} sm={6} md={4} key={speaker.id}>
                        <Card sx={{ position: 'relative' }}>
                            {/* Dots Menu */}
                            <div style={{ position: 'relative' }}>
                                <IconButton
                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={(event) => handleMenuOpen(event, speaker.id)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                >
                                    {/* <MenuItem onClick={handleViewDetail}>View detail</MenuItem> */}
                                    <MenuItem onClick={handleDelete}>Xóa</MenuItem>
                                </Menu>
                            </div>

                            {/* Speaker Information */}
                            <CardContent>
                                {/* Show image if available */}
                                <Avatar
                                    src={imageUrls[speaker.image] || ''}
                                    alt={speaker.name}
                                    sx={{ width: 56, height: 56, marginBottom: 2 }}
                                />
                                <Typography variant="h4" gutterBottom>
                                    {speaker.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {speaker.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ marginTop: 1 }}>
                                    {speaker.description}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ marginTop: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <EmailOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} /> {speaker.email}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <PhoneOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} /> {speaker.phone}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <LocationOnOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} />{' '}
                                    {speaker.address}
                                </Typography>
                            </CardContent>

                            {/* Preview Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                <Link to={`/speakers/${speaker.id}/detail`} style={{ textDecoration: 'none' }}>
                                    <Button variant="outlined" size="small">
                                        Xem thử
                                    </Button>
                                </Link>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SpeakerList;
