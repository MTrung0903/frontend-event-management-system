import React, { useState, useEffect } from "react";

import { Box, Grid, Typography, Paper, Card, CardContent } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import EventTable from "./EventTable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const eventData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Sự kiện đã hoàn thành",
        data: [12, 14, 3, 5, 2, 3, 4, 8, 11, 5, 9, 13],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Sự kiện bị hủy",
        data: [2, 3, 1, 4, 2, 0, 0, 3, 1, 1, 2, 0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const sponsorData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Số nhà tài trợ",
        data: [5, 6, 4, 7, 3, 5, 6, 8, 4, 6, 7, 5],
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
                12
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
                30
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
                50
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
      <EventTable />
    </Box>
  );
};

export default AdminDashboard;
