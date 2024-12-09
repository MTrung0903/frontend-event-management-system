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

const ViewService = ({eventid, providerid}) => {
  console.log("eventId" + eventid)
  console.log("providerId"+ providerid)
  const  providerId  = providerid
  const  eventId  = eventid
  console.log("eventIdssssssss" + eventId)
  console.log("providerIdssssssssssss"+ providerId)
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderInEvent(eventId, providerId);
        setProvider(data);
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
      {provider.listProviderServices &&
      provider.listProviderServices.length > 0 ? (
        <Grid container spacing={2}>
          {provider.listProviderServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                      mb: 1,
                      fontSize: "1rem",
                      color: "#333",
                    }}
                  >
                    {service.serviceName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Loại:</strong> {service.serviceType}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Giá:</strong> {service.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Thời gian sử dụng:</strong> {service.duration}
                  </Typography>
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
