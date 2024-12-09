import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  Divider,
  DialogActions,
  DialogContent,
  Dialog,
  useTheme,
  Card,
  CardMedia,
  CardContent
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CreateEventForm from './EventAdd';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
const EventDetail = () => {
  const theme = useTheme();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);

  const handleDialogEditOpen = () => setIsDialogEditOpen(true);
  const handleDialogEditClose = () => setIsDialogEditOpen(false);

  const formatDateTime = (dateTimeString) => {
    const [date, time] = dateTimeString.split(" ");
    const [hours, minutes] = time.split(":");
    return `${date} ${hours}:${minutes}`;
  };

  const fetchAPI = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/man/event/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.statusCode === 0) {
        setEvent(response.data.data);
        const imageUrl = `http://localhost:8080/file/${response.data.data.eventImg}`;
        const imageResponse = await axios.get(imageUrl, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          responseType: "blob",
        });
        const blobUrl = URL.createObjectURL(imageResponse.data);
        setEventImage(blobUrl);
      }
    } catch (error) {
      console.error("Error fetching event details", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ 
      overflow: "hidden", 
      width: '100%', 
      margin: 'auto', 
      marginTop: '1px', 
      boxShadow: 3,
      backgroundColor: '#f5f5f5',
      padding: '0 20px' // Padding cho phần nội dung
    }}>
      {eventImage && (
        <CardMedia
          component="img"
          height="300"
          image={eventImage}
          alt={event.eventName}
          sx={{ objectFit: "cover", marginTop: '10px',  }}
        />
      )}
      <CardContent sx={{ padding: '0 40px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: '#4A4A4A', fontFamily: 'Arial, sans-serif' ,marginTop:'10px'}}>
            {event.eventName}
          </Typography>
          <IconButton onClick={handleDialogEditOpen} sx ={{marginTop:'10px'}}>
            <EditOutlinedIcon />
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Grid container spacing={2} direction="column" sx={{ lineHeight: 2, paddingLeft: '10px', paddingRight: '10px' }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarMonthOutlinedIcon sx={{ color: "primary.main", marginRight: 1 }} />
              <Typography variant="h6" sx={{ color: '#757575', fontStyle: 'italic' }}>
                Thời gian
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {`${formatDateTime(event.eventStart)} - ${formatDateTime(event.eventEnd)}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnOutlinedIcon sx={{ color: "primary.main", marginRight: 1 }} />
              <Typography variant="h6" sx={{ color: '#757575', fontStyle: 'italic' }}>
                Địa điểm
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {event.eventLocation}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
             
              <Typography variant="h6" sx={{ color: '#757575', fontStyle: 'italic' }}>
                Chủ sự kiện
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '1.8' , paddingLeft:'30px', alignItems:'center'}}>
            <SupervisedUserCircleOutlinedIcon sx={{ color: "primary.main", marginRight: 1, alignItems:'center',justifyContent:'center' }} />
              {event.eventHost}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <DescriptionIcon sx={{ color: "primary.main", marginRight: 1 }} />
              <Typography variant="h6" sx={{ color: '#757575', fontStyle: 'italic' }}>
                Mô tả
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '1.6' }}>
              {event.eventDescription}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog
        open={isDialogEditOpen}
        onClose={handleDialogEditClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "900px",
            maxWidth: "none",
          },
        }}
        fullWidth
      >
        <DialogContent>
          <CreateEventForm
            onClose={handleDialogEditClose}
            eventId={eventId}
            event={event}
            eventImage={eventImage}
            handleFetch={fetchAPI}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogEditClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventDetail;
