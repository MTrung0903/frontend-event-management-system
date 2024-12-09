import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const events = [
  { id: 1, name: "VIETNAMWOOD - Triển lãm quốc tế ngành công nghiệp chế biến gỗ", date: "2024-12-7", status: "Hoàn thành" },
  { id: 2, name: "TUẦN LỄ ÂM NHẠC VIỆT NAM 2024 - VIETNAM MUSIC WEEK 2024", date: "2024-12-14", status: "Sắp diễn ra" },
  { id: 3, name: "Triển lãm Quốc tế Thành phố Thông minh Châu Á 2024.", date: "2024-12-15", status: "Sắp diễn ra" },
];

const EventTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Tên sự kiện</TableCell>
            <TableCell>Ngày tổ chức</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={event.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.status}</TableCell>
              <TableCell>
                <Button variant="contained" size="small" color="primary">
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
