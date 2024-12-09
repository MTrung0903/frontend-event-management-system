import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const SponsorCard = ({ sponsor, onDelete }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const fetchImage = async (sponsorLogo) => {
    try {
        const response = await axios.get(`http://localhost:8080/file/${sponsor.sponsorLogo}`, {
            headers: {
              Authorization: localStorage.getItem("token")
            },
            responseType: 'blob',
          });
      const url = URL.createObjectURL(response.data);
      setImageUrl(url);
    } catch (error) {
      console.error("Error loading image:", error);
    } finally {
      setLoadingImage(false);
    }
  };
  useEffect(() => {
    if (sponsor.sponsorLogo) {
      setLoadingImage(true); // Bắt đầu quá trình tải
      fetchImage(sponsor.sponsorLogo);
    }
  }, [sponsor.sponsorLogo]); // Chạy lại khi sponsor.sponsorLogo thay đổi

  return (
    <Card>
      {loadingImage ? (
        <CircularProgress />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={sponsor.name}
        />
      )}
      <CardContent>
        <Typography variant="h6">{sponsor.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Sponsorship Level: {sponsor.sponsorshipLevel}
        </Typography>
      </CardContent>
    </Card>
  );
};

const SponsorForEvent = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [availableSponsors, setAvailableSponsors] = useState([]);
  const [loadingAddSponsor, setLoadingAddSponsor] = useState(false);

  const { eventId } = useParams();
  const apiUrl = `http://localhost:8080/man/event/${eventId}/sponsors`;
  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
  
      if (response.data.statusCode === 0) {
        setSponsors(response.data.data);
      } else {
        setError("Failed to fetch sponsors");
      }
    } catch (err) {
      setError("An error occurred while fetching sponsors");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSponsors();
  }, [apiUrl]);

  const handleDeleteSponsor = (id) => {
    setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== id));
  };

  const fetchAvailableSponsors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listponsor`, {
            headers: {
              "Content-Type": "application/json",
              Authorization:localStorage.getItem("token"),
            },
          }
      );
      if (response.data.statusCode === 0) {
        setAvailableSponsors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching available sponsors:", error);
    }
  };

  const handleAddSponsor = async (sponsorId) => {
    console.log("add sponsor for event")
    setLoadingAddSponsor(true);
    try {
      await axios.post(
        `http://localhost:8080/man/event/${eventId}/sponsors/${sponsorId}`,null, {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
      );
      await fetchAvailableSponsors();
      await fetchSponsors();
    } catch (error) {
      console.error("Error adding sponsor:", error);
    } finally {
      setLoadingAddSponsor(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Nhà tài cho sự kiện</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            fetchAvailableSponsors();
            setOpenAddDialog(true);
          }}
          sx={{
            backgroundColor: "#1c7de8",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Thêm nhà tài trợ
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {sponsors.map((sponsor) => (
            <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
              <SponsorCard sponsor={sponsor} onDelete={handleDeleteSponsor} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Thêm nhà tài trợ cho sự kiện</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {availableSponsors.map((sponsor) => (
              <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
                <Card
                  onClick={() => handleAddSponsor(sponsor.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                    position: "relative",
                  }}
                >
                  {loadingAddSponsor && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  <SponsorCard sponsor={sponsor} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SponsorForEvent;
