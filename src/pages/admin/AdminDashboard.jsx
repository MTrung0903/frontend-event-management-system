import React, { useState, useEffect } from "react";

import { Box, Grid, Typography, Paper, Card, CardContent } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import EventTable from "./EventTable";
import axios from "axios";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminDashboard = ({ setSelectedEvent }) => { 
  const [eventTotal, setEventTotal] = useState(0);
  const [device, setDevice] = useState(0);
  const [employee, setEmployee] = useState(0);
  const [eventCompleted, setEventCompleted] = useState(null);
  const [eventCancel, setEventCancel] = useState(null);
  const [sponsor, setSponsor] = useState(null);
  const [events, setEvent] = useState(null);
  const fetchAPI = async () => {
    try {
        const response = await axios.get("http://localhost:8080/admin/events/overview", {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        const data = response.data.data;
        setEventTotal(data.totalEvents);
        setDevice(data.totalDevices);
        setEmployee(data.totalEmployees);
        setEventCompleted(data.cntCompleted);
        setEventCancel(data.cntCancel);
        setSponsor(data.cntSponsor);
        setEvent(data.listEvent);
        //console.log(response.data.data)
        
        //console.log("Data for dropdown:", sponsorshipLevels);
    } catch (error) {
        console.error("Error fetching sponsorship levels:", error);
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  const eventData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Sự kiện đã hoàn thành",
        data: eventCompleted,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Sự kiện bị hủy",
        data: eventCancel,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const sponsorData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Số nhà tài trợ",
        data: sponsor,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <Box p={1}>
      <Typography variant="h4" gutterBottom>
        Báo cáo tổng quan
      </Typography>

      {/* Báo cáo tổng quan */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Số sự kiện đã hoàn thành
              </Typography>
              <Typography variant="h3" color="primary">
                {eventTotal}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Số thiết bị đang sử dụng
              </Typography>
              <Typography variant="h3" color="secondary">
               {device}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Tổng số nhân viên
              </Typography>
              <Typography variant="h3" color="success.main">
                {employee}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Biểu đồ phân tích */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sự kiện theo tháng
              </Typography>
              <Bar data={eventData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nhà tài trợ theo tháng
              </Typography>
              <Bar data={sponsorData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quản lý sự kiện */}
      <Typography variant="h5" gutterBottom>
        Quản lý sự kiện
      </Typography>
      <EventTable events={events || []} setSelectedEvent={setSelectedEvent} />

    </Box>
  );
};

export default AdminDashboard;
