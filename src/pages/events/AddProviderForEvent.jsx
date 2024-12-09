import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  MoreVert,
  DeleteOutline,
  EditOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  LanguageOutlined,
  PersonOutline,
} from "@mui/icons-material";
import axios from "axios";

import ProviderTabs from "../providers/AddProvider";
import ViewService from "../providers/ChooseService";

export const deleteProviderEvent = async (eventId, providerId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/event/${eventId}/del-provider/${providerId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete provider:", error);
    throw error;
  }
};
const AddProviderForEvent = () => {
  const { eventId } = useParams();
  const [providers, setProviders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogDetailOpen, setIsDialogDetailOpen] = useState(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogDetailOpen = () => setIsDialogDetailOpen(true);
  const handleDialogDetailClose = () => setIsDialogDetailOpen(false);

  const handleProviderAdded = () => {
    fetchAvailableProviders();
    setDialogOpen(false);
  };
  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/providers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const fetchAvailableProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listprovider`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAvailableProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching available providers:", error);
    }
  };

  const addProvider = async (providerId) => {
    try {
      console.log(eventId, providerId);
      await axios.post(
        `http://localhost:8080/man/event/${eventId}/providers/${providerId}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Provider added successfully!");
      fetchAvailableProviders();
      fetchProviders();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setSelectedProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const removeProvider = async (providerId) => {
    try {
      await deleteProviderEvent(eventId, providerId);
      alert("Provider deleted successfully!");
      fetchProviders();
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [eventId]);

  return (
    <Box sx={{ marginLeft: "20px", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Nhà cung cấp dịch vụ cho sự kiện
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleDialogOpen();
          fetchAvailableProviders();
        }}
        sx={{
          backgroundColor: "#1c7de8",
          color: "#ffffff",
          fontWeight: "bold",
          maxHeight: 45,
          "&:hover": { backgroundColor: "#1565c0" },
          marginBottom: "20px"
        }}
      >
        Thêm nhà cung cấp dịch vụ
      </Button>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {providers.map((provider) => (
          <Card
            key={provider.id}
            sx={{
              width: "350px",
              backgroundColor: "#f9f9f9",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {provider.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonOutline
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Liên hệ: {provider.contact}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <EmailOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Email: {provider.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PhoneOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                SĐT: {provider.phone}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LocationOnOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Địa chỉ: {provider.address}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LanguageOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Website: <a href={provider.website}>{provider.website}</a>
              </Typography>
              <IconButton
                sx={{ float: "right" }}
                onClick={(e) => handleMenuOpen(e, provider)}
              >
                <MoreVert />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleDialogDetailOpen(); // Mở dialog chi tiết
          }}
        >
          {" "}
          <EditOutlined fontSize="small" /> Xem chi tiết{" "}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            removeProvider(selectedProvider.id);
          }}
        >
          <DeleteOutline fontSize="small" sx={{ color: "#A3B8D0" }} /> Xóa
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "900px",
            maxWidth: "none",
          },
        }}
        fullWidth
      >
        <DialogTitle>Thêm nhà cung cấp dịch vụ</DialogTitle>
        <DialogContent>
          <ProviderTabs
            onClose={handleDialogClose}
            onProviderAdded={handleProviderAdded}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialog view detail */}
      <Dialog
        open={isDialogDetailOpen}
        onClose={handleDialogDetailClose}
        sx={{ "& .MuiDialog-paper": { width: "900px", maxWidth: "none" } }}
        fullWidth
      >
        <DialogTitle>Chi tiết nhà cung cấp dịch vụ</DialogTitle>
        <DialogContent>
          {selectedProvider && (
            <ViewService eventid={eventId} providerid={selectedProvider.id} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogDetailClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddProviderForEvent;
