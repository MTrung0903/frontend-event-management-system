import React, { useState, useEffect } from "react";

import axios from "axios";
import {  styled } from "@mui/material/styles";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  IconButton
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


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
    setRentalData(updatedRentalData); 
  };
  
useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderInEvent(eventId, providerId);
        setProvider(data);

      
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
<Container
  sx={{
    p: 4,
    backgroundColor: "#f9f9f9", // Nền nhạt
    borderRadius: 2, // Bo góc nhẹ cho container
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Tạo hiệu ứng shadow nhẹ
  }}
>
  {provider.listProviderServices && provider.listProviderServices.length > 0 ? (
    <Grid container spacing={3}>
      {provider.listProviderServices.map((service, index) => (
        <Grid item  key={index}>
          <CustomCard
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: "1.25rem",
                  color: "#2c3e50",
                  textAlign: "center", // Căn giữa tiêu đề
                }}
              >
                {service.serviceName}
              </Typography>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <strong style={{ width: "35%", flexShrink: 0, color: "#34495e" }}>Loại:</strong>
                <Typography variant="body2" sx={{ color: "#7f8c8d", fontSize: "14px" }}>
                  {service.serviceType}
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <strong style={{ width: "35%", flexShrink: 0, color: "#34495e" }}>Giá:</strong>
                <Typography variant="body2" sx={{ color: "#7f8c8d", fontSize: "14px" }}>
                  {service.price}
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <strong style={{ width: "35%", flexShrink: 0, color: "#34495e" }}>Ngày thuê:</strong>
                <Typography variant="body2" sx={{ color: "#7f8c8d", fontSize: "14px" }}>
                  <input
                    type="datetime-local"
                    value={rentalData[service.id]?.rentalDate || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #dcdde1",
                      backgroundColor: "#ecf0f1",
                    }}
                  />
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <strong style={{ width: "35%", flexShrink: 0, color: "#34495e" }}>Ngày hết hạn:</strong>
                <Typography variant="body2" sx={{ color: "#7f8c8d", fontSize: "14px" }}>
                  <input
                    type="datetime-local"
                    value={rentalData[service.id]?.expDate || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #dcdde1",
                      backgroundColor: "#ecf0f1",
                    }}
                  />
                </Typography>
              </div>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <IconButton
                  sx={{
                    color: "#3498db",
                    "&:hover": { backgroundColor: "rgba(52, 152, 219, 0.1)" },
                  }}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: "#e74c3c",
                    "&:hover": { backgroundColor: "rgba(231, 76, 60, 0.1)" },
                  }}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            </CardContent>
          </CustomCard>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="h6" textAlign="center" sx={{ color: "#7f8c8d", mt: 4 }}>
      Dịch vụ không khả dụng.
    </Typography>
  )}
</Container>


  );
};

export default ViewService;
