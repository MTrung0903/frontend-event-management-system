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
import { tokens } from "../../theme";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditOutlined from '@mui/icons-material/EditOutlined';
import CreateEventForm from './EventAdd'
const EventDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { eventId } = useParams(); // Lấy eventId từ URL
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null); // Trạng thái URL ảnh
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const handleDialogEditOpen = () => setIsDialogEditOpen(true);
  const handleDialogEditClose = () => setIsDialogEditOpen(false);
  const handleFetch = () => {
    fetchAPI();
  };
  const formatDateTime = (dateTimeString) => {
    // Tách chuỗi dựa trên khoảng trắng và dấu hai chấm
    const [date, time] = dateTimeString.split(" ");
    const [hours, minutes] = time.split(":");

    // Ghép lại chuỗi theo định dạng mong muốn
    return `${date} ${hours}:${minutes}`;
  };
  const fetchAPI = async () => {
    try {
      axios
        .get(`http://localhost:8080/man/event/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.data.statusCode === 0) {
            setEvent(response.data.data);
            console.log(response.data.data);
            // Lấy ảnh từ API
            const imageUrl = `http://localhost:8080/file/${response.data.data.eventImg}`;
            axios
              .get(imageUrl, {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
                responseType: "blob", // Lấy dữ liệu ảnh dưới dạng blob
              })
              .then((imageResponse) => {
                const blobUrl = URL.createObjectURL(imageResponse.data);
                setEventImage(blobUrl); // Lưu URL tạm thời của ảnh
              })
              .catch((imageError) => {
                console.error("Error fetching event image", imageError);
              });
          }
        })
    }
    catch (error) {
      console.error("Error fetching event details", error);
    }
    finally {

    }

  }
  useEffect(() => {
    fetchAPI()
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Card
    fullWidth
      sx={{
        margin: "0 auto",
        borderRadius: 2,
        boxShadow: 5,
        overflow: "hidden",
        marginTop: 3,
        padding: 3
      }}
    >
      {/* Event Image */}
      {eventImage && (
        <CardMedia
          component="img"
          height="200"
          image={eventImage} // URL tạm thời của ảnh
          alt={event.eventName}
          sx={{ objectFit: "cover" }}
        />
      )}

      {/* Event Content */}
      <CardContent sx={{ padding: 3}}>
        {/* Event Name */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {event.eventName}
          </Typography>
          <IconButton onClick={handleDialogEditOpen}>
            <EditOutlinedIcon />
          </IconButton>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Event Date */}
        <Grid container alignItems="flex-start" sx={{ marginBottom: 2 }}>
          <Grid item>
            <EventNoteIcon sx={{ color: "primary.main", marginRight: 1 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="body1">
              <strong>Thời gian:</strong> {`${formatDateTime(event.eventStart)} - ${formatDateTime(event.eventEnd)}`}
            </Typography>
          </Grid>
        </Grid>

        {/* Event Location */}
        <Grid container alignItems="center" sx={{ marginBottom: 2 }}>
          <Grid item>
            <LocationOnIcon sx={{ color: "primary.main", marginRight: 1 }} />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <strong>Địa điểm:</strong> {event.eventLocation}
            </Typography>
          </Grid>
        </Grid>

        {/* Event Host */}
        <Grid container alignItems="flex-start" sx={{ marginBottom: 2 }}>
          <Grid item>
            <DescriptionIcon sx={{ color: "primary.main", marginRight: 1 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="body1">
              <strong>Chủ sự kiện:</strong> {event.eventHost}
            </Typography>
          </Grid>
        </Grid>

        {/* Event Description */}
        <Grid container alignItems="flex-start">
          <Grid item>
            <DescriptionIcon sx={{ color: "primary.main", marginRight: 1 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="body1">
              <strong>Mô tả:</strong> {event.eventDescription}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {/* Dialog for Editing */}
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
            handleFetch={handleFetch}
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
