import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Swal from "sweetalert2";
import { format } from "date-fns";


const CustomCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
}));
const fetchProviderInEvent = async (eventId, providerId) => {
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
const fetchRentalService = async (eventId, serviceId) => {
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
const deleteServiceRental = async (eventId, serviceId) => {
  await axios.delete(
    `http://localhost:8080/man/event/${eventId}/del-ser/${serviceId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};
const formatDateTime = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");



const ViewService = ({ eventid, providerid ,onClose}) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalData, setRentalData] = useState({});
  const [editableServiceId, setEditableServiceId] = useState(null);
  const updateServiceRental = async (eventId, service) => {
    try {
      const formattedService = {
        ...service,
        rentalDate: formatDateTime(service.rentalDate),
        expDate: formatDateTime(service.expDate),
      };
  
      if (new Date(formattedService.expDate) < new Date(formattedService.rentalDate)) {
        
        Swal.fire({
          title: "Error",
          text: "Ngày hết hạn không thể trước ngày thuê.",
          icon: "error",
          confirmButtonText: "OK"
        });
        onClose()
        return;
      }
  
      const response = await axios.put(
        `http://localhost:8080/man/event/${eventId}/update-ser-rental`,
        formattedService,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
  
      console.log("Cập nhật thành công:", response.data);
      onClose()
      Swal.fire({
        title: "Success",
        text: "Cập nhật dịch vụ thành công.",
        icon: "success",
        confirmButtonText: "OK"
      });
  
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error.response || error.message);
    }
  };
  const handleDateChange = (e, serviceId, dateType) => {
    setRentalData((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [dateType]: e.target.value,
      },
    }));
  };

  const handleDelete = async (serviceId) => {
    await deleteServiceRental(eventid, serviceId);
      setProvider((prev) => ({
        ...prev,
        listProviderServices: prev.listProviderServices.filter(
          (service) => service.id !== serviceId
        ),
      }));
     
  };

  const handleUpdate = async (service, serviceId) => {
    const updatedService = {
      ...service,
      ...rentalData[serviceId],
      serviceId: serviceId, 
      eventId: eventid,
    };
  
    await updateServiceRental(eventid, updatedService);
    setEditableServiceId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerData = await fetchProviderInEvent(eventid, providerid);
        setProvider(providerData);

        const rentalInfo = {};
        for (const service of providerData.listProviderServices) {
          const rentalDetails = await fetchRentalService(eventid, service.id);
          rentalInfo[service.id] = {
            rentalDate: rentalDetails.rentalDate,
            expDate: rentalDetails.expDate,
          };
        }
        setRentalData(rentalInfo);
      } catch {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventid, providerid]);

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" sx={{ color: "red", textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      {provider?.listProviderServices?.length ? (
        <Grid container spacing={3}>
          {provider.listProviderServices.map((service) => (
            <Grid item xs={12} sm={6} md={6} key={service.id}>
              <CustomCard>
                <CardContent>
                  <Typography variant="h5" textAlign="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
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
                      {parseInt(service.price).toLocaleString("vi-VN") + " vnđ"}
                    </Typography>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Ngày thuê:
                    </Typography>
                    <input
                      type="datetime-local"
                      value={rentalData[service.id]?.rentalDate || ""}
                      onChange={(e) => handleDateChange(e, service.id, "rentalDate")}
                      disabled={editableServiceId !== service.id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Ngày hết hạn:
                    </Typography>
                    <input
                      type="datetime-local"
                      value={rentalData[service.id]?.expDate || ""}
                      onChange={(e) => handleDateChange(e, service.id, "expDate")}
                      disabled={editableServiceId !== service.id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  {editableServiceId === service.id ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <Button
                        onClick={() => handleUpdate(service, service.id)}
                        variant="contained"
                        color="primary"
                        sx={{ padding: '8px 16px' }}
                      >
                        Lưu
                      </Button>
                      <Button
                        onClick={() => setEditableServiceId(null)}
                        variant="outlined"
                        color="secondary"
                        sx={{ padding: '8px 16px' }}
                      >
                        Hủy
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <IconButton onClick={() => setEditableServiceId(service.id)} color="primary">
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(service.id)} color="error">
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" variant="body1" sx={{ marginTop: 2 }}>
          Không có dịch vụ nào.
        </Typography>
      )}
  </>
  );
};

export default ViewService;
