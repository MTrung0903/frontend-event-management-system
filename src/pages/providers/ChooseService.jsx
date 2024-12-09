import React, { useState, useEffect } from "react";

import axios from "axios";
import { useTheme, styled } from "@mui/material/styles";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#446FC1",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#1BB5D1",
  },
}));

const CustomCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
}));

const getProviderInEvent = async (eventId, providerId) => {
  const response = await axios.get(
    `http://localhost:8080/man/event/${eventId}/detail-ser/${providerId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data.data;
};
const getRentalService = async (eventId, serviceId) => {
  const response = await axios.get(
    `http://localhost:8080/man/proService/${eventId}/detail-ser/${serviceId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data.data;
};

const ViewService = ({eventid, providerid}) => {

  const  providerId  = providerid
  const  eventId  = eventid
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalData, setRentalData] = useState({});
  const handleDateChange = (e, serviceId, dateType) => {
    const updatedRentalData = { ...rentalData };
    updatedRentalData[serviceId] = {
      ...updatedRentalData[serviceId],
      [dateType]: e.target.value,
    };
    setRentalData(updatedRentalData); // Cập nhật state rentalData
  };
  
useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderInEvent(eventId, providerId);
        setProvider(data);

        // Lấy rentalData cho từng service
        const rentalInfo = {};
        for (const service of data.listProviderServices) {
          console.log(service.id)
          const rentalDetails = await getRentalService(eventId, service.id);
          rentalInfo[service.id] = {
            rentalDate: rentalDetails.rentalDate,
            expDate: rentalDetails.expDate,
          };
        }
        setRentalData(rentalInfo);
      } catch (err) {
        setError("Failed to fetch provider details");
      } finally {
        setLoading(false);
      }
    };
    if (eventId && providerId) {
      fetchProvider();
    }
  }, [eventId, providerId]);
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        {" "}
        <CircularProgress />{" "}
      </Box>
    );
  }
  if (error) {
    return (
      <Typography
        variant="h6"
        sx={{ color: "red", textAlign: "center", marginTop: 4 }}
      >
        {" "}
        {error}{" "}
      </Typography>
    );
  }

  return (
<Container sx={{ mt: 4, mb: 4 }}>
  <Typography
    variant="h4"
    sx={{ fontWeight: "bold", mb: 2, fontSize: "32px", color: "#333" }}
  >
    {provider.name}
  </Typography>
  {provider.listProviderServices && provider.listProviderServices.length > 0 ? (
    <Grid container spacing={2}>
      {provider.listProviderServices.map((service, index) => (
        <Grid item xs={12} sm={4} md={6} key={index}>
          <CustomCard
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fff",
              "&:hover": {
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  mb: 1.5,
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                {service.serviceName}
              </Typography>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <strong style={{ width: "30%", flexShrink: 0 }}>Loại:</strong>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px" }}>
                  {service.serviceType}
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <strong style={{ width: "30%", flexShrink: 0 }}>Giá:</strong>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px" }}>
                  {service.price}
                </Typography>
              </div>
              

              {/* Chỉ hiển thị ngày thuê và ngày hết hạn, disable input */}
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <strong style={{ width: "30%", flexShrink: 0 }}>Ngày thuê:</strong>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px" }}>
                  <input
                    type="datetime-local"
                    value={rentalData[service.id]?.rentalDate || ""}
                    disabled
                    style={{ width: "92%" }}
                  />
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <strong style={{ width: "30%", flexShrink: 0 }}>Ngày hết hạn:</strong>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px" }}>
                  <input
                    type="datetime-local"
                    value={rentalData[service.id]?.expDate || ""}
                    disabled
                    style={{ width: "92%" }}
                  />
                </Typography>
              </div>
            </CardContent>
          </CustomCard>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography>Dịch vụ không khả dụng.</Typography>
  )}
</Container>

  );
};

export default ViewService;
