import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const ProviderServiceDetail = ({serviceid}) => {
  const serviceId  = serviceid


  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/man/proService',
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        //console.log("Fetching providerId from URL:", serviceId);
        const response = await axiosInstance.get(`/${serviceId}`);

        console.log(response.data); 
        setServiceData(response.data.data);
      } catch (err) {
        console.error('Error fetching service data: ', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
        
      }
    };

    fetchServiceData();
  }, [serviceId]);



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Box>
    );
  }


  if (error) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <Typography variant="h6">Lỗi: {error}</Typography>
      </Box>
    );
  }


  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        {serviceData?.serviceName}
      </Typography>

      <Paper sx={{ padding: '20px', boxShadow: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Loại dịch vụ:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.serviceType}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Chi tiết:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.serviceDesc}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Price:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.price}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Duration:
        </Typography>
        <Typography sx={{ marginBottom: '20px' }}>
          {serviceData?.duration}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          

          {/* Nếu cần chỉnh sửa dịch vụ */}
          <Button variant="contained" color="primary">
            Edit Service
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProviderServiceDetail;
