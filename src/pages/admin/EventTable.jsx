import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const EventTable = ({events}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Chế độ 12 giờ (AM/PM)
    });
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Tên sự kiện</TableCell>
            <TableCell>Người tổ chức sự kiện</TableCell>
            <TableCell>Ngày tổ chức</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={event.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{event.eventName}</TableCell>
              <TableCell>{event.eventHost}</TableCell>
              <TableCell>{formatDate(event.eventStart)} - {formatDate(event.eventEnd)}</TableCell>
              <TableCell>{event.eventStatus}</TableCell>
              <TableCell>
                <Button variant="contained" size="small" sx = {{backgroundColor:"#1c7ee3"}}>
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventTable;
