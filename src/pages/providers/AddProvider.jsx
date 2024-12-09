import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  MenuItem,
  Select,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProviderTabs = ({onClose,onProviderAdded}) => {
  const { eventId } = useParams();
  const [providers, setProviders] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listprovider`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data?.data) {
        setProviders(response.data.data);
        setActiveTab(response.data.data[0]?.id || '');
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };
  const addProvider = async (providerId) => {
    try {
      //console.log(eventId, providerId);
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
      fetchProviders();
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  const addServiceForEvent = async (eventId, serviceId) => {
    const response = await axios.post(
        `http://localhost:8080/man/event/${eventId}/add-ser/${serviceId}`,null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
      }
    );
    return response.data;
  };
  
 
  useEffect(() => {
   
    fetchProviders();
  }, [eventId]);

  // Handle tab change
  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  // Handle checkbox toggle
  const handleServiceToggle = (providerId, serviceId) => {
    setSelectedServices((prevState) => ({
      ...prevState,
      [providerId]: {
        ...prevState[providerId],
        [serviceId]: !prevState[providerId]?.[serviceId],
      },
    }));
  };

// Handle save action
const handleSave = async () => {
  try {
    const providerIds = Object.keys(selectedServices);
    for (const providerId of providerIds) {
      await addProvider(providerId);

      const serviceIds = Object.keys(selectedServices[providerId]).filter(
        (serviceId) => selectedServices[providerId][serviceId] 
      );

      for (const serviceId of serviceIds) {
        await addServiceForEvent(eventId, serviceId);
      }
    }
    alert("Lưu dịch vụ và nhà cung cấp dịch vụ thành công");
    fetchProviders()
    onProviderAdded()
    onClose()
  } catch (error) {
    console.error("Error saving services and providers:", error);
    alert("Lưu thất bại. Thử lại sau");
  }
};


  return (
    <Box>
      {/* Dropdown Menu for Tabs */}
      <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none", p: 2 }}>
        <Select
          value={activeTab}
          onChange={handleTabChange}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          ))}
        </Select>
      </AppBar>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {providers.map((provider) => (
          <Box
            role="tabpanel"
            hidden={activeTab !== provider.id}
            key={provider.id}
            id={`tabpanel-${provider.id}`}
            aria-labelledby={`tab-${provider.id}`}
          >
            {activeTab === provider.id && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
                  Chi tiết nhà cung cấp dịch vụ
                </Typography>
                <Typography>Email: {provider.email}</Typography>
                <Typography>SĐT: {provider.phone}</Typography>
                <Typography>Địa chỉ: {provider.address}</Typography>

                {/* List of Services */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {provider.listProviderServices.length > 0 ? (
                    provider.listProviderServices.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service.id}>
                        <Card variant="outlined" sx={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", borderRadius: 2, position: 'relative' }}>
                          <Checkbox
                            checked={selectedServices[provider.id]?.[service.id] || false}
                            onChange={() => handleServiceToggle(provider.id, service.id)}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          />
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "600" }}>{service.serviceName}</Typography>
                            <Typography>Loại: {service.serviceType}</Typography>
                            <Typography>Chi tiết: {service.serviceDesc}</Typography>
                            <Typography>Giá: {service.price}</Typography>
                            <Typography>Thời gian sử dụng: {service.duration}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography>Không có dịch vụ nào khả dụng cho nhà cung cấp dịch vụ này</Typography>
                  )}
                </Grid>
              </>
            )}
          </Box>
        ))}
      </Box>

      {/* Save Button */}
      <Box sx={{ textAlign: "right", mt: 4, pr: 3 }}>
        <Button variant="contained" sx={{ backgroundColor: "#42D2EC", color: "#fff", fontWeight: "bold" }} onClick={handleSave}>
          Lưu
        </Button>
      </Box>
    </Box>
  );
};

export default ProviderTabs;
